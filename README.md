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
    - url: /hacsfiles/lovelace-numberbox-card/numberbox-card.js
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
| border | bool | `true` | set to `false` to hide borders

## Examples

![numberbox-card](https://github.com/htmltiger/numberbox-card/raw/main/example.png)

Basic configuration:
```yaml
- type: custom:numberbox-card
  entity: input_number.my_slider
```

```yaml
- type: custom:numberbox-card
  entity: input_number.my_slider
  name: My Title
  icon: 'mdi:fire'
  border: false
```

