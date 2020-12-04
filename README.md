# numberbox-card

NumberBox for input sliders

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
| entity | string | **Required** | `input_number.my_slider`
| name | string/bool | `friendly_name` | Override friendly name (set to `false` to hide)
| icon | string/bool | `icon` | Override icon (set to `false` to hide)
| border | bool | `false` | set to `true` to show borders
| speed | number | `0` | default disabled, milliseconds for long press auto change (eg. 250) 
| icon_plus | string | `mdi:plus` | custom icon
| icon_minus | string | `mdi:minus` | custom icon
| unit | string/bool  | `unit_of_measurement` | Override unit string (set to `false` to hide)
## Examples

![numberbox-card](https://github.com/htmltiger/numberbox-card/raw/main/example.png)

Configurations:
```
type: entities
entities:
  - entity: input_number.my_slider
    type: 'custom:numberbox-card'
    icon_plus: 'mdi:chevron-up'
    icon_minus: 'mdi:chevron-down'
    style: |
      .cur-num{font-size:40px!important}
```

```yaml
- type: custom:numberbox-card
  entity: input_number.my_slider
  name: My Title
  icon: 'mdi:fire'
  border: true
  speed: 250
```

