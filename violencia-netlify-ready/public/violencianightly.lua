local config = {
    jitter_threshold = 20.0,
    flick_yaw_threshold = 70.0,
    dt_extra_ticks = 14,
    gravity = 800.0,
    halo_segments_near = 16,
    halo_segments_far = 10,
    halo_distance_threshold = 2500.0,
    target_cache_ticks = 4,
    jitter_history_size = 6,
    jitter_min_samples = 3
}

local master_text = "violencia resolver"
local master_label = {}
local master_segments = 4

for i = 1, master_segments do
    local first_character = math.floor(((i - 1) * #master_text) / master_segments) + 1
    local last_character = math.floor((i * #master_text) / master_segments)
    local progress = (i - 1) / (master_segments - 1)
    local red = math.floor(255 * (1 - progress) + 0.5)
    local color = string.format("\a%02x0000ff", red)
    master_label[#master_label + 1] = color .. master_text:sub(first_character, last_character)
end

local master_toggle = ui.new_checkbox("rage", "other", table.concat(master_label))
local weapon_group_names = {"g3sg1 / scar-20", "ssg 08", "awp", "r8 revolver", "desert eagle", "pistol"}
local weapon_group_selector = ui.new_combobox("rage", "other", "weapon group", weapon_group_names)
local weapon_profiles = {}

for i = 1, #weapon_group_names do
    local group_name = weapon_group_names[i]
    weapon_profiles[group_name] = {
        target_hitboxes = ui.new_multiselect("rage", "other", group_name .. " target hitboxes", {"head", "chest", "stomach", "arms", "legs", "feet"}),
        ping_preset = ui.new_combobox("rage", "other", group_name .. " ping preset", {"auto (real ping)", "low (0-20ms)", "avg (20-60ms)", "high (60-120ms)", "poor (120-170ms)"}),
        predictors = ui.new_multiselect("rage", "other", group_name .. " advanced predictors", {"extra prediction (14 ticks)", "jitterfix (center yaw)", "flickfix (defensive flick)", "baim if lethal"}),
        baim_hp = ui.new_slider("rage", "other", group_name .. " baim hp threshold", 1, 100, 30, true, "hp"),
        hitbox_ids = {}
    }
end

local visuals_multiselect = ui.new_multiselect("rage", "other", "visual indicators", {"draw predict", "draw real position", "show ping under crosshair"})
local predict_label = ui.new_label("rage", "other", "   predict color")
local predicted_color_picker = ui.new_color_picker("rage", "other", "predict color", 255, 215, 0, 255)
local real_label = ui.new_label("rage", "other", "   real color")
local real_color_picker = ui.new_color_picker("rage", "other", "real color", 255, 255, 255, 200)
local tracer_multiselect = ui.new_multiselect("rage", "other", "tracer origin", {"center", "bottom-center", "top-center"})
local tracer_label = ui.new_label("rage", "other", "   tracer color")
local tracer_color_picker = ui.new_color_picker("rage", "other", "tracer color", 0, 200, 255, 255)
local clantag_toggle = ui.new_checkbox("rage", "other", "clantag")
local clantag_mode = ui.new_combobox("rage", "other", "clantag mode", {"static", "loop"})

local profile_defaults_key = "violencia.top.profile_defaults.v1"

if not database.read(profile_defaults_key) then
    for i = 1, #weapon_group_names do
        local profile = weapon_profiles[weapon_group_names[i]]
        if #ui.get(profile.target_hitboxes) == 0 then
            ui.set(profile.target_hitboxes, "head")
        end
    end
    if #ui.get(visuals_multiselect) == 0 then
        ui.set(visuals_multiselect, "draw predict")
    end
    database.write(profile_defaults_key, true)
end

local rage_force_safe_point = ui.reference("rage", "aimbot", "Force safe point")
local rage_avoid_unsafe = ui.reference("rage", "aimbot", "Avoid unsafe hitboxes")

local clantag_spammer = nil
local clantag_spammer_ok, clantag_spammer_reference = pcall(ui.reference, "misc", "miscellaneous", "Clan tag spammer")

if clantag_spammer_ok then
    clantag_spammer = clantag_spammer_reference
end

local original_client_set_clan_tag = client.set_clan_tag
local clantag_hook_active = true

local function prioritized_client_set_clan_tag(text)
    if clantag_hook_active and ui.get(master_toggle) and ui.get(clantag_toggle) then
        return
    end
    return original_client_set_clan_tag(text)
end

client.set_clan_tag = prioritized_client_set_clan_tag

local enemy_angle_history = {}
local enemy_flick_history = {}
local previous_tracer_selection = {}
local cached_ping_seconds = 0.010
local last_measured_ping = -1.0

local cached_target_enemy = nil
local cached_target_tick = -1

local previous_baim_target = nil
local baim_force_active = false
local rage_overrides_active = false
local saved_force_safe_point_key = 0
local saved_avoid_unsafe = nil

local math_sin = math.sin
local math_cos = math.cos
local math_sqrt = math.sqrt
local math_abs = math.abs
local math_atan2 = math.atan2
local math_floor = math.floor
local math_rad = math.rad
local math_deg = math.deg
local math_pi = math.pi

local clantag_last_text = nil
local clantag_last_force_time = 0
local clantag_owned = false
local clantag_spammer_saved = nil

local function set_clantag_text(text, force)
    local realtime = globals.realtime()
    if clantag_last_text == text and (not force or realtime - clantag_last_force_time < 0.05) then
        return
    end
    original_client_set_clan_tag(text)
    clantag_last_text = text
    clantag_last_force_time = realtime
end

local function acquire_clantag_priority()
    if clantag_spammer ~= nil then
        if clantag_spammer_saved == nil then
            clantag_spammer_saved = ui.get(clantag_spammer)
        end
        if ui.get(clantag_spammer) then
            ui.set(clantag_spammer, false)
        end
    end
end

local function release_clantag_priority()
    if clantag_spammer ~= nil and clantag_spammer_saved ~= nil then
        ui.set(clantag_spammer, clantag_spammer_saved)
    end
    clantag_spammer_saved = nil
end

local function update_clantag()
    local enabled = ui.get(master_toggle) and ui.get(clantag_toggle)
    if not enabled then
        if clantag_owned then
            set_clantag_text("")
            clantag_owned = false
            release_clantag_priority()
        end
        return
    end
    acquire_clantag_priority()
    clantag_owned = true
    if ui.get(clantag_mode) == "static" then
        set_clantag_text("violencia.top", true)
        return
    end
    local source = "violencia.top "
    local shift = math_floor(globals.realtime() * 3) % #source
    local text = source:sub(shift + 1) .. source:sub(1, shift)
    set_clantag_text(text, true)
end

local function contains(list, value)
    if not list then
        return false
    end
    for i = 1, #list do
        if list[i] == value then
            return true
        end
    end
    return false
end

local weapon_group_by_item_definition = {
    [1] = "desert eagle",
    [2] = "pistol",
    [3] = "pistol",
    [4] = "pistol",
    [9] = "awp",
    [11] = "g3sg1 / scar-20",
    [30] = "pistol",
    [32] = "pistol",
    [36] = "pistol",
    [38] = "g3sg1 / scar-20",
    [40] = "ssg 08",
    [61] = "pistol",
    [63] = "pistol",
    [64] = "r8 revolver"
}

local function get_selected_weapon_profile()
    return weapon_profiles[ui.get(weapon_group_selector)]
end

local function get_active_weapon_profile(local_player)
    local weapon = entity.get_player_weapon(local_player)
    if not weapon then
        return get_selected_weapon_profile()
    end
    local item_definition = entity.get_prop(weapon, "m_iItemDefinitionIndex")
    if not item_definition then
        return get_selected_weapon_profile()
    end
    local group_name = weapon_group_by_item_definition[bit.band(item_definition, 65535)]
    return weapon_profiles[group_name] or get_selected_weapon_profile()
end

local function apply_rage_overrides()
    if rage_overrides_active then
        return
    end
    local force_safe_active, force_safe_mode, force_safe_key = ui.get(rage_force_safe_point)
    saved_force_safe_point_key = force_safe_key or 0
    saved_avoid_unsafe = ui.get(rage_avoid_unsafe)
    ui.set(rage_force_safe_point, "Always on", saved_force_safe_point_key)
    local new_avoid = {}
    local head_found = false
    if type(saved_avoid_unsafe) == "table" then
        for i = 1, #saved_avoid_unsafe do
            new_avoid[#new_avoid + 1] = saved_avoid_unsafe[i]
            if saved_avoid_unsafe[i] == "Head" then
                head_found = true
            end
        end
    end
    if not head_found then
        new_avoid[#new_avoid + 1] = "Head"
    end
    ui.set(rage_avoid_unsafe, unpack(new_avoid))
    rage_overrides_active = true
end

local function restore_rage_overrides()
    if not rage_overrides_active then
        return
    end
    ui.set(rage_force_safe_point, "On hotkey", saved_force_safe_point_key)
    if type(saved_avoid_unsafe) == "table" then
        local restored_avoid = {}
        for i = 1, #saved_avoid_unsafe do
            if saved_avoid_unsafe[i] ~= "Head" then
                restored_avoid[#restored_avoid + 1] = saved_avoid_unsafe[i]
            end
        end
        ui.set(rage_avoid_unsafe, restored_avoid)
    else
        ui.set(rage_avoid_unsafe, {})
    end
    saved_force_safe_point_key = 0
    saved_avoid_unsafe = nil
    rage_overrides_active = false
end

local function reset_baim_override()
    if previous_baim_target then
        plist.set(previous_baim_target, "Override prefer body aim", "-")
        previous_baim_target = nil
    end
    baim_force_active = false
    restore_rage_overrides()
end

local function update_baim_if_lethal(target_enemy, profile)
    local active_predictors = ui.get(profile.predictors)
    local baim_enabled = contains(active_predictors, "baim if lethal")

    if not baim_enabled then
        if baim_force_active then
            reset_baim_override()
        end
        return
    end

    if not target_enemy or not entity.is_alive(target_enemy) or entity.is_dormant(target_enemy) then
        if baim_force_active then
            reset_baim_override()
        end
        return
    end

    if previous_baim_target and previous_baim_target ~= target_enemy then
        plist.set(previous_baim_target, "Override prefer body aim", "-")
        previous_baim_target = nil
        baim_force_active = false
        restore_rage_overrides()
    end

    local target_hp = entity.get_prop(target_enemy, "m_iHealth")
    if not target_hp then
        if baim_force_active then
            reset_baim_override()
        end
        return
    end

    local threshold = ui.get(profile.baim_hp)

    if target_hp <= threshold then
        if not baim_force_active or previous_baim_target ~= target_enemy then
            plist.set(target_enemy, "Override prefer body aim", "Force")
            apply_rage_overrides()
            previous_baim_target = target_enemy
            baim_force_active = true
        end
    else
        if baim_force_active then
            plist.set(target_enemy, "Override prefer body aim", "-")
            restore_rage_overrides()
            previous_baim_target = target_enemy
            baim_force_active = false
        end
    end
end

local function update_baim_slider_visibility()
    local state = ui.get(master_toggle)
    local selected_group = ui.get(weapon_group_selector)
    for i = 1, #weapon_group_names do
        local group_name = weapon_group_names[i]
        local profile = weapon_profiles[group_name]
        local profile_visible = state and group_name == selected_group
        local baim_enabled = contains(ui.get(profile.predictors), "baim if lethal")
        ui.set_visible(profile.baim_hp, profile_visible and baim_enabled)
    end
end

local function update_ui_visibility()
    local state = ui.get(master_toggle)
    local selected_group = ui.get(weapon_group_selector)
    ui.set_visible(clantag_toggle, state)
    ui.set_visible(clantag_mode, state and ui.get(clantag_toggle))
    ui.set_visible(weapon_group_selector, state)
    for i = 1, #weapon_group_names do
        local group_name = weapon_group_names[i]
        local profile = weapon_profiles[group_name]
        local profile_visible = state and group_name == selected_group
        ui.set_visible(profile.target_hitboxes, profile_visible)
        ui.set_visible(profile.ping_preset, profile_visible)
        ui.set_visible(profile.predictors, profile_visible)
    end
    ui.set_visible(visuals_multiselect, state)
    ui.set_visible(tracer_multiselect, state)

    if state then
        local active_visuals = ui.get(visuals_multiselect)
        local draw_pred = contains(active_visuals, "draw predict")
        local draw_real = contains(active_visuals, "draw real position")
        ui.set_visible(predict_label, draw_pred)
        ui.set_visible(predicted_color_picker, draw_pred)
        ui.set_visible(real_label, draw_real)
        ui.set_visible(real_color_picker, draw_real)

        local selected_tracers = ui.get(tracer_multiselect)
        local has_tracer = #selected_tracers > 0
        ui.set_visible(tracer_label, has_tracer)
        ui.set_visible(tracer_color_picker, has_tracer)
    else
        ui.set_visible(predict_label, false)
        ui.set_visible(predicted_color_picker, false)
        ui.set_visible(real_label, false)
        ui.set_visible(real_color_picker, false)
        ui.set_visible(tracer_label, false)
        ui.set_visible(tracer_color_picker, false)
        reset_baim_override()
    end

    update_baim_slider_visibility()
end

local function handle_tracer_selection()
    local selected = ui.get(tracer_multiselect)
    if #selected > 1 then
        local newly_added = nil
        for i = 1, #selected do
            if not contains(previous_tracer_selection, selected[i]) then
                newly_added = selected[i]
                break
            end
        end
        if newly_added then
            ui.set(tracer_multiselect, {newly_added})
            previous_tracer_selection = {newly_added}
        else
            ui.set(tracer_multiselect, {selected[1]})
            previous_tracer_selection = {selected[1]}
        end
    else
        previous_tracer_selection = selected
    end
    update_ui_visibility()
end

local function handle_predictors_change(profile)
    local active_predictors = ui.get(profile.predictors)
    local baim_enabled = contains(active_predictors, "baim if lethal")
    if not baim_enabled and baim_force_active then
        reset_baim_override()
    end
    update_baim_slider_visibility()
end

local function rebuild_hitbox_cache(profile)
    local selected_groups = ui.get(profile.target_hitboxes)
    local ids = {}
    if contains(selected_groups, "head") then
        ids[#ids + 1] = {id = 0, radius = 7.0, offset = 7.0}
    end
    if contains(selected_groups, "chest") then
        ids[#ids + 1] = {id = 4, radius = 5.0, offset = 0.0}
    end
    if contains(selected_groups, "stomach") then
        ids[#ids + 1] = {id = 2, radius = 5.0, offset = 0.0}
    end
    if contains(selected_groups, "arms") then
        ids[#ids + 1] = {id = 13, radius = 4.0, offset = 0.0}
        ids[#ids + 1] = {id = 15, radius = 4.0, offset = 0.0}
    end
    if contains(selected_groups, "legs") then
        ids[#ids + 1] = {id = 7, radius = 4.5, offset = 0.0}
        ids[#ids + 1] = {id = 8, radius = 4.5, offset = 0.0}
    end
    if contains(selected_groups, "feet") then
        ids[#ids + 1] = {id = 11, radius = 3.5, offset = 0.0}
        ids[#ids + 1] = {id = 12, radius = 3.5, offset = 0.0}
    end
    profile.hitbox_ids = ids
end

local function handle_master_toggle_change()
    update_ui_visibility()
    update_clantag()
end

ui.set_callback(master_toggle, handle_master_toggle_change)
ui.set_callback(clantag_toggle, function()
    update_ui_visibility()
    update_clantag()
end)
ui.set_callback(clantag_mode, update_clantag)
ui.set_callback(weapon_group_selector, update_ui_visibility)
ui.set_callback(visuals_multiselect, update_ui_visibility)
ui.set_callback(tracer_multiselect, handle_tracer_selection)

local function register_weapon_profile_callbacks(profile)
    ui.set_callback(profile.target_hitboxes, function()
        rebuild_hitbox_cache(profile)
    end)
    ui.set_callback(profile.predictors, function()
        handle_predictors_change(profile)
    end)
end

for i = 1, #weapon_group_names do
    local profile = weapon_profiles[weapon_group_names[i]]
    register_weapon_profile_callbacks(profile)
    rebuild_hitbox_cache(profile)
end

update_ui_visibility()

local function normalize_angle(angle)
    while angle > 180.0 do
        angle = angle - 360.0
    end
    while angle < -180.0 do
        angle = angle + 360.0
    end
    return angle
end

local function circular_mean_yaw(history)
    local sum_sin = 0.0
    local sum_cos = 0.0
    for i = 1, #history do
        local rad = math_rad(history[i])
        sum_sin = sum_sin + math_sin(rad)
        sum_cos = sum_cos + math_cos(rad)
    end
    return math_deg(math_atan2(sum_sin, sum_cos))
end

local function process_jitterfix(enemy, is_enabled)
    if not is_enabled or not enemy then
        return false, 0.0
    end

    local cur_simtime = entity.get_prop(enemy, "m_flSimulationTime")
    local pitch, yaw = entity.get_prop(enemy, "m_angEyeAngles")
    if not yaw or not cur_simtime then
        return false, 0.0
    end

    if not enemy_angle_history[enemy] then
        enemy_angle_history[enemy] = {
            samples = {},
            last_simtime = cur_simtime,
            was_jittering = false,
            last_center = yaw
        }
    end

    local record = enemy_angle_history[enemy]

    if cur_simtime == record.last_simtime then
        return record.was_jittering, record.last_center
    end

    record.last_simtime = cur_simtime

    local samples = record.samples
    samples[#samples + 1] = yaw
    if #samples > config.jitter_history_size then
        table.remove(samples, 1)
    end

    if #samples < config.jitter_min_samples then
        record.was_jittering = false
        record.last_center = yaw
        return false, yaw
    end

    local total_delta = 0.0
    for i = 2, #samples do
        total_delta = total_delta + math_abs(normalize_angle(samples[i] - samples[i - 1]))
    end

    local avg_delta = total_delta / (#samples - 1)
    local is_jittering = avg_delta > config.jitter_threshold

    if is_jittering then
        record.last_center = circular_mean_yaw(samples)
    else
        record.last_center = yaw
    end

    record.was_jittering = is_jittering
    return is_jittering, record.last_center
end

local function process_flickfix(enemy, is_enabled)
    if not is_enabled or not enemy then
        return false, 0.0
    end

    local cur_simtime = entity.get_prop(enemy, "m_flSimulationTime")
    local pitch, cur_yaw = entity.get_prop(enemy, "m_angEyeAngles")
    if not cur_simtime or not cur_yaw then
        return false, 0.0
    end

    if not enemy_flick_history[enemy] then
        enemy_flick_history[enemy] = {
            last_simtime = cur_simtime,
            last_processed_simtime = cur_simtime,
            last_stable_yaw = cur_yaw,
            is_flicking = false
        }
    end

    local record = enemy_flick_history[enemy]

    if cur_simtime == record.last_processed_simtime then
        return record.is_flicking, record.last_stable_yaw
    end

    record.last_processed_simtime = cur_simtime

    local sim_diff = cur_simtime - record.last_simtime
    local yaw_diff = math_abs(normalize_angle(cur_yaw - record.last_stable_yaw))

    if sim_diff < 0 or yaw_diff > config.flick_yaw_threshold then
        record.is_flicking = true
        record.last_simtime = cur_simtime
        return true, record.last_stable_yaw
    end

    record.is_flicking = false
    record.last_stable_yaw = cur_yaw
    record.last_simtime = cur_simtime

    return false, cur_yaw
end

local function get_active_ping_ms(local_player)
    local net_latency = client.latency()
    local ms_value = 0
    if net_latency then
        ms_value = math_floor((net_latency * 1000.0) + 0.5)
    end

    local player_resource = entity.get_player_resource()
    if player_resource and local_player then
        local scoreboard_ping = entity.get_prop(player_resource, "m_iPing", local_player)
        if scoreboard_ping then
            local half_scoreboard = math_floor(scoreboard_ping * 0.5 + 0.5)
            if half_scoreboard > ms_value then
                ms_value = half_scoreboard
            end
        end
    end

    return ms_value, (ms_value / 1000.0)
end

local function get_ping_delay_seconds(local_player, profile)
    local selection = ui.get(profile.ping_preset)
    if selection == "auto (real ping)" then
        local ping_ms, ping_sec = get_active_ping_ms(local_player)
        if ping_sec ~= last_measured_ping then
            last_measured_ping = ping_sec
            cached_ping_seconds = ping_sec
        end
        return cached_ping_seconds, ping_ms
    elseif selection == "low (0-20ms)" then
        return 0.010, 10
    elseif selection == "avg (20-60ms)" then
        return 0.040, 40
    elseif selection == "high (60-120ms)" then
        return 0.090, 90
    elseif selection == "poor (120-170ms)" then
        return 0.145, 145
    end
    return 0.010, 10
end

local function check_target_hittable(local_player, enemy)
    local lx, ly, lz = client.eye_position()
    local hx, hy, hz = entity.hitbox_position(enemy, 0)
    if not hx or not lx then
        return false
    end

    if client.visible(hx, hy, hz) then
        return true
    end

    if client.trace_bullet then
        local hit_ent, damage = client.trace_bullet(local_player, lx, ly, lz, hx, hy, hz)
        if damage and damage > 0 and (hit_ent == enemy or hit_ent == nil or hit_ent == 0) then
            return true
        end
    end

    return false
end

local function get_crosshair_distance(local_player, enemy_x, enemy_y, enemy_z)
    local lx, ly, lz = client.eye_position()
    if not lx then
        return 99999.0
    end

    local screen_enemy_x, screen_enemy_y = renderer.world_to_screen(enemy_x, enemy_y, enemy_z)
    if not screen_enemy_x then
        return 99999.0
    end

    local screen_w, screen_h = client.screen_size()
    if not screen_w then
        return 99999.0
    end

    local cx, cy = screen_w * 0.5, screen_h * 0.5
    local dx = screen_enemy_x - cx
    local dy = screen_enemy_y - cy
    return math_sqrt(dx * dx + dy * dy)
end

local function find_prioritized_target(local_player)
    local current_tick = globals.tickcount()
    if cached_target_enemy and (current_tick - cached_target_tick) < config.target_cache_ticks then
        if entity.is_alive(cached_target_enemy) and not entity.is_dormant(cached_target_enemy) then
            return cached_target_enemy
        end
    end

    local lx, ly, lz = entity.get_prop(local_player, "m_vecOrigin")
    if not lx then
        return nil
    end

    local enemies = entity.get_players(true)
    local best_hittable_enemy = nil
    local best_hittable_crosshair = 99999.0

    local best_fallback_enemy = nil
    local shortest_fallback_dist = 99999999.0

    for i = 1, #enemies do
        local enemy = enemies[i]
        if entity.is_alive(enemy) and not entity.is_dormant(enemy) then
            local ex, ey, ez = entity.get_prop(enemy, "m_vecOrigin")
            if ex then
                if check_target_hittable(local_player, enemy) then
                    local crosshair_dist = get_crosshair_distance(local_player, ex, ey, ez)
                    if crosshair_dist < best_hittable_crosshair then
                        best_hittable_crosshair = crosshair_dist
                        best_hittable_enemy = enemy
                    end
                else
                    local delta_x = ex - lx
                    local delta_y = ey - ly
                    local delta_z = ez - lz
                    local dist = math_sqrt(delta_x * delta_x + delta_y * delta_y + delta_z * delta_z)
                    if dist < shortest_fallback_dist then
                        shortest_fallback_dist = dist
                        best_fallback_enemy = enemy
                    end
                end
            end
        end
    end

    local result = best_hittable_enemy or best_fallback_enemy
    cached_target_enemy = result
    cached_target_tick = current_tick
    return result
end

local function calculate_predicted_hitbox(enemy, delay_seconds, active_predictors, hitbox_info)
    local hx, hy, hz = entity.hitbox_position(enemy, hitbox_info.id)
    if not hx then
        return nil, nil, nil
    end

    local vel_x, vel_y, vel_z = entity.get_prop(enemy, "m_vecVelocity")
    if not vel_x then
        return nil, nil, nil
    end

    local flags = entity.get_prop(enemy, "m_fFlags")
    if not flags then
        return nil, nil, nil
    end

    local is_on_ground = bit.band(flags, 1) ~= 0
    local tick_interval = globals.tickinterval()

    local extra_ticks = 0
    if contains(active_predictors, "extra prediction (14 ticks)") then
        local enemy_speed = math_sqrt(vel_x * vel_x + vel_y * vel_y)
        if enemy_speed > 1.0 then
            extra_ticks = config.dt_extra_ticks
        end
    end

    local total_time = delay_seconds + ((1 + extra_ticks) * tick_interval)

    local pred_x = hx + (vel_x * total_time)
    local pred_y = hy + (vel_y * total_time)
    local pred_z

    if is_on_ground then
        pred_z = hz + (vel_z * total_time)
    else
        pred_z = hz + (vel_z * total_time) - (0.5 * config.gravity * total_time * total_time)
    end

    return pred_x, pred_y, pred_z, hx, hy, hz
end

local function draw_3d_halo(center_x, center_y, center_z, radius, height_offset, red, green, blue, alpha, segments)
    local halo_z = center_z + height_offset
    local num_segments = segments or config.halo_segments_near
    local step = (math_pi * 2.0) / num_segments
    local prev_screen_x, prev_screen_y = nil, nil
    local first_screen_x, first_screen_y = nil, nil

    for i = 0, num_segments - 1 do
        local angle = i * step
        local world_x = center_x + (radius * math_cos(angle))
        local world_y = center_y + (radius * math_sin(angle))
        local screen_x, screen_y = renderer.world_to_screen(world_x, world_y, halo_z)

        if screen_x and screen_y then
            if i == 0 then
                first_screen_x, first_screen_y = screen_x, screen_y
            end
            if prev_screen_x and prev_screen_y then
                renderer.line(prev_screen_x, prev_screen_y, screen_x, screen_y, red, green, blue, alpha)
            end
            prev_screen_x, prev_screen_y = screen_x, screen_y
        else
            prev_screen_x, prev_screen_y = nil, nil
        end
    end

    if prev_screen_x and prev_screen_y and first_screen_x and first_screen_y then
        renderer.line(prev_screen_x, prev_screen_y, first_screen_x, first_screen_y, red, green, blue, alpha)
    end
end

local function draw_target_tracer(target_x, target_y, tracer_mode, red, green, blue, alpha)
    local screen_w, screen_h = client.screen_size()
    if not screen_w or not screen_h then
        return
    end

    local src_x, src_y = screen_w * 0.5, screen_h * 0.5
    if tracer_mode == "bottom-center" then
        src_x, src_y = screen_w * 0.5, screen_h
    elseif tracer_mode == "top-center" then
        src_x, src_y = screen_w * 0.5, 0
    end

    renderer.line(src_x, src_y, target_x, target_y, red, green, blue, alpha)
end

local function get_distance_to_local(local_player, enemy)
    local lx, ly, lz = entity.get_prop(local_player, "m_vecOrigin")
    local ex, ey, ez = entity.get_prop(enemy, "m_vecOrigin")
    if not lx or not ex then
        return 0
    end
    local dx = ex - lx
    local dy = ey - ly
    local dz = ez - lz
    return math_sqrt(dx * dx + dy * dy + dz * dz)
end

local function on_paint()
    if not ui.get(master_toggle) then
        reset_baim_override()
        return
    end

    local local_player = entity.get_local_player()
    if not local_player or not entity.is_alive(local_player) then
        reset_baim_override()
        return
    end

    local active_profile = get_active_weapon_profile(local_player)
    local active_visuals = ui.get(visuals_multiselect)
    local active_predictors = ui.get(active_profile.predictors)
    local selected_tracers = ui.get(tracer_multiselect)
    local ping_delay, ping_ms = get_ping_delay_seconds(local_player, active_profile)

    if contains(active_visuals, "show ping under crosshair") then
        local screen_w, screen_h = client.screen_size()
        if screen_w and screen_h then
            local pos_x = (screen_w * 0.5) + 8
            local pos_y = (screen_h * 0.5) + 8
            local ping_text = string.format("ping: %d ms", ping_ms)
            renderer.text(pos_x, pos_y, 255, 255, 255, 255, "d", 0, ping_text)
        end
    end

    local target_enemy = find_prioritized_target(local_player)

    update_baim_if_lethal(target_enemy, active_profile)

    if not target_enemy then
        return
    end

    local is_jitterfix_enabled = contains(active_predictors, "jitterfix (center yaw)")
    local is_flickfix_enabled = contains(active_predictors, "flickfix (defensive flick)")

    local is_jittering, center_yaw = process_jitterfix(target_enemy, is_jitterfix_enabled)
    local is_flicking, stable_yaw = process_flickfix(target_enemy, is_flickfix_enabled)

    local target_hitboxes = active_profile.hitbox_ids
    local red, green, blue, alpha = ui.get(predicted_color_picker)
    local real_r, real_g, real_b, real_a = ui.get(real_color_picker)
    local tr_r, tr_g, tr_b, tr_a = ui.get(tracer_color_picker)
    local should_draw_predict = contains(active_visuals, "draw predict")
    local should_draw_real = contains(active_visuals, "draw real position")
    local active_tracer_mode = #selected_tracers > 0 and selected_tracers[1] or nil

    local enemy_dist = get_distance_to_local(local_player, target_enemy)
    local halo_segments = enemy_dist > config.halo_distance_threshold and config.halo_segments_far or config.halo_segments_near

    for i = 1, #target_hitboxes do
        local hb_info = target_hitboxes[i]
        local pred_x, pred_y, pred_z, real_x, real_y, real_z = calculate_predicted_hitbox(
            target_enemy, ping_delay, active_predictors, hb_info
        )

        if pred_x then
            if should_draw_predict then
                if is_flicking then
                    draw_3d_halo(pred_x, pred_y, pred_z, hb_info.radius, hb_info.offset, 255, 0, 255, alpha, halo_segments)
                elseif is_jittering then
                    draw_3d_halo(pred_x, pred_y, pred_z, hb_info.radius, hb_info.offset, 255, 100, 0, alpha, halo_segments)
                else
                    draw_3d_halo(pred_x, pred_y, pred_z, hb_info.radius, hb_info.offset, red, green, blue, alpha, halo_segments)
                end
            end

            if should_draw_real and real_x then
                draw_3d_halo(real_x, real_y, real_z, hb_info.radius * 0.85, hb_info.offset, real_r, real_g, real_b, real_a, halo_segments)
            end

            if active_tracer_mode and i == 1 then
                local screen_tx, screen_ty = renderer.world_to_screen(pred_x, pred_y, pred_z)
                if screen_tx and screen_ty then
                    draw_target_tracer(screen_tx, screen_ty, active_tracer_mode, tr_r, tr_g, tr_b, tr_a)
                end
            end
        end
    end
end

local function on_round_start()
    enemy_angle_history = {}
    enemy_flick_history = {}
    cached_target_enemy = nil
    cached_target_tick = -1
    reset_baim_override()
end

local function on_player_death(event)
    if not event or not event.userid then
        return
    end
    local dead_player = client.userid_to_entindex(event.userid)
    if dead_player and previous_baim_target == dead_player then
        reset_baim_override()
    end
end

local function on_paint_ui()
    update_clantag()
end

client.set_event_callback("paint", on_paint)
client.set_event_callback("paint_ui", on_paint_ui)
client.set_event_callback("round_start", on_round_start)
client.set_event_callback("player_death", on_player_death)

local function on_shutdown()
    reset_baim_override()
    if clantag_owned then
        set_clantag_text("")
        clantag_owned = false
    end
    release_clantag_priority()
    clantag_hook_active = false
    if client.set_clan_tag == prioritized_client_set_clan_tag then
        client.set_clan_tag = original_client_set_clan_tag
    end
    ui.set_visible(clantag_toggle, false)
    ui.set_visible(clantag_mode, false)
    ui.set_visible(predict_label, false)
    ui.set_visible(predicted_color_picker, false)
    ui.set_visible(real_label, false)
    ui.set_visible(real_color_picker, false)
    ui.set_visible(tracer_label, false)
    ui.set_visible(tracer_color_picker, false)
    ui.set_visible(weapon_group_selector, false)
    for i = 1, #weapon_group_names do
        local profile = weapon_profiles[weapon_group_names[i]]
        ui.set_visible(profile.target_hitboxes, false)
        ui.set_visible(profile.ping_preset, false)
        ui.set_visible(profile.predictors, false)
        ui.set_visible(profile.baim_hp, false)
    end
    ui.set_visible(visuals_multiselect, false)
    ui.set_visible(tracer_multiselect, false)
end

client.set_event_callback("shutdown", on_shutdown)

