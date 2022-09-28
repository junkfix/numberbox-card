# numberbox-card

NumberBox for input sliders and number entities

Inspired from [simple thermostat](https://github.com/nervetattoo/simple-thermostat)

## Installation

Manually add numberbox-card.js
to your `<config>/www/` folder and add the following to the `configuration.yaml` file:
```yaml
lovelace:
  resources:
    - url: /local/numberbox-card.js?v=1
      type: module
```

_OR_ install using [HACS](https://hacs.xyz/) and add this (if in YAML mode):
```yaml
lovelace:
  resources:
    - url: /hacsfiles/numberbox-card/numberbox-card.js
      type: module
```

The above configuration can be managed directly in the Configuration -> Lovelace Dashboards -> Resources panel when not using YAML mode,
or added by clicking the "Add to lovelace" button on the HACS dashboard after installing the plugin.


## Configuration

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:numberbox-card`
| entity | string | **Required** | `input_number.my_slider` or `number.my_number`
| name | string/bool | `friendly_name` | Override friendly name (set to `false` to hide)
| picture | string/bool | `entity_picture` | picture as icon eg. `/local/picture.png` local is www folder (picture has priority over icon so set to `false` to hide / display icon instead) 
| icon | string/bool | `icon` | Override icon (set to `false` to hide)
| border | bool | `false` | set to `true` to show borders
| icon_plus | string | `mdi:plus` | custom icon
| icon_minus | string | `mdi:minus` | custom icon
| initial | number | `?` | initial value when `unknown` or `unavailable` state
| delay | string | `1000` | delay after pressing in ms, `0` to disable
| speed | string | `0` | long press speed in ms, `0` to disable
| secondary_info | string |  | `last-changed` `last-updated` or any text/html,<br />you can also display states or other attributes of any entity for eg. <br /> `Light is %light.office_1:state` <br />`Room temp is %climate.heating:attributes:current_temperature`
| unit | string/bool  | `unit_of_measurement` | Override unit string (set to `false` to hide) <br />`time` to display the number in hh:mm:ss<br />`timehm` to display the number in hh:mm

#### Advanced Config for climate/fan etc


| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| state | string | `undefined` | set it for attribute display
| min | number | attribute `min` |  
| max | number | attribute `max`  |  
| step | number | attribute `step`  |  
| step_entity | string | | eg `sensor.my_step_size`  |  
| param | string | `value` |  service parameter
| service | string | `input_number.set_value` |  service name
| moreinfo | string | entity | More info click entity, `false` to disable  |  

```
type: entities
entities:
  - type: custom:numberbox-card
    entity: climate.heating
    icon: mdi:fire
    state: temperature
    service: climate.set_temperature
    param: temperature
    min: 0
    max: 30
    step: 0.5
    speed: 500

type: entities
entities:
  - type: custom:numberbox-card
    entity: fan.smartfan_fan
    icon: mdi:fan
    state: percentage
    service: fan.set_percentage
    param: percentage
    min: 0
    max: 100
    step: 20

type: entities
entities:
  - type: custom:numberbox-card
    entity: input_datetime.timer_time
    service: input_datetime.set_datetime
    param: time
    unit: time
    step: 60


# Timer duration change
type: entities
entities:
  - type: custom:numberbox-card
    entity: timer.heating
    icon: mdi:fire
    service: timer.start
    param: duration
    state: duration
    min: 0
    max: 999999
    step: 60
    unit: time
```

![numberbox-card](https://github.com/htmltiger/numberbox-card/raw/main/example3.png)
```
type: entities
entities:
  - type: custom:numberbox-card
    entity: climate.downstairs_heating
    icon: mdi:fire
    service: climate.set_temperature
    param: temperature
    state: temperature
    min: 0
    max: 30
    step: 0.5
    secondary_info: >
      Mode:<b style="color:red"> %climate.downstairs_heating:attributes:hvac_action </b><br />
      Current temp:<b style="color:green"> %climate.downstairs_heating:attributes:current_temperature </b>
```


## Examples

![numberbox-card](https://github.com/htmltiger/numberbox-card/raw/main/example.png)

Configurations:
```
type: entities
title: Example
show_header_toggle: false
entities:
  - entity: input_number.my_slider
    secondary_info: last-changed
  
  - entity: input_number.my_slider
    type: 'custom:numberbox-card'
    icon: 'mdi:timelapse'
    secondary_info: last-changed
    unit: S

  - entity: input_number.my_slider
    type: 'custom:numberbox-card'
    unit: time

  - entity: input_number.my_slider
    type: 'custom:numberbox-card'
    icon_plus: 'mdi:chevron-up'
    icon_minus: 'mdi:chevron-down'
    style: |
      .cur-num{font-size:25px !important}
      .cur-num.upd{color:green}
      .cur-unit{color:orange; font-size:100% !important; opacity:1 !important}
      .grid-left{color:red}
      .grid-right{color:blue}

style: |
  #states{padding:8px 10px !important}
```
![numberbox-card](https://github.com/htmltiger/numberbox-card/raw/main/example2.png)
```yaml
- type: custom:numberbox-card
  entity: input_number.my_slider
  name: My Title
  icon: 'mdi:fire'
  border: true
  card_mod:
    style: |
      ha-card .cur-num {
         color: green;
       }  
```

 
![numberbox-card](https://github.com/htmltiger/numberbox-card/raw/main/example4.png)
```yaml
type: horizontal-stack
cards:
  - type: custom:numberbox-card
    border: true
    entity: number.office_temp
    name: false
    style: >
      .body{display:block!important}
      .body::after{text-align:center;font-size:10px;content:"Temperature";display:block!important}
  - type: custom:numberbox-card
    border: true
    entity: number.office_timer
    unit: time
    name: false
    style: >
      .body{display:block!important}
      .body::after{text-align:center;font-size:10px;content:"Minutes";display:block!important}
```


It is also possible to add this using `+ Add Card` UI and choose `Custom: Numberbox Card`
