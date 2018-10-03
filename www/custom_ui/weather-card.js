class WeatherCard extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement('ha-card');
      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = '/local/custom_ui/weather-card.css';
      card.appendChild(link);
      this.content = document.createElement('div');
      this.content.className = 'card';
      card.appendChild(this.content);
      this.appendChild(card);
    }

    const getUnit = function (measure) {
      const lengthUnit = hass.config.unit_system.length;
      switch (measure) {
        case 'air_pressure':
          return lengthUnit === 'km' ? 'hPa' : 'inHg';
        case 'length':
          return lengthUnit;
        case 'precipitation':
          return lengthUnit === 'km' ? 'mm' : 'in';
        default:
          return hass.config.unit_system[measure] || '';
      }
    };

    const getIcon = function (condition, day) {
      var sunLocation_days = day > 0 ? 'day' : sunLocation;
      const weatherIcons_days = {
        'clear-night': `${sunLocation_days}`,
        'cloudy': 'cloudy',
        'fog': 'cloudy',
        'hail': 'rainy-7',
        'lightning': 'thunder',
        'lightning-rainy': 'thunder',
        'partlycloudy': `cloudy-${sunLocation_days}-3`,
        'pouring': 'rainy-6',
        'rainy': 'rainy-5',
        'snowy': 'snowy-6',
        'snowy-rainy': 'rainy-7',
        'sunny': `${sunLocation_days}`,
        'windy': 'cloudy',
        'windy-variant': `cloudy-${sunLocation_days}-3`,
        'exceptional': '!!',
      }
      return weatherIcons_days[condition];
    }

    const transformDayNight = {
      "below_horizon": "night",
      "above_horizon": "day",
    }
    var sunLocation = transformDayNight[hass.states[this.config.entity_sun].state];
    const weatherIcons = {
      'clear-night': `${sunLocation}`,
      'cloudy': 'cloudy',
      'fog': 'cloudy',
      'hail': 'rainy-7',
      'lightning': 'thunder',
      'lightning-rainy': 'thunder',
      'partlycloudy': `cloudy-${sunLocation}-3`,
      'pouring': 'rainy-6',
      'rainy': 'rainy-5',
      'snowy': 'snowy-6',
      'snowy-rainy': 'rainy-7',
      'sunny': `${sunLocation}`,
      'windy': 'cloudy',
      'windy-variant': `cloudy-${sunLocation}-3`,
      'exceptional': '!!',
    }

    const windDirections = [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
      'N'
    ];
    const entity = hass.states[this.config.entity_weather];
    const currentCondition = entity.state;
    const humidity = entity.attributes.humidity;
    const pressure = entity.attributes.pressure;
    const temperature = Math.round(entity.attributes.temperature);
    const visibility = entity.attributes.visibility;
    const windBearing = windDirections[(parseInt((entity.attributes.wind_bearing + 11.25) / 22.5))];
    const windSpeed = entity.attributes.wind_speed;
    const forecast = entity.attributes.forecast.slice(0, 5);

    var options = { weekday: 'long', month: 'long', day: 'numeric' };
    var today = new Date();
    var longDate = today.toLocaleDateString("en-US", options);

    var options = { hour: "2-digit", minute: "2-digit" };
    var time = new Date();
    var formattedTime = time.toLocaleDateString([], options);
    var formattedTimeArray = formattedTime.split(' ');
    var time = formattedTimeArray[1] + ' ' + formattedTimeArray[2];

    this.content.innerHTML = `
      <span class="icon bigger" style="background: none, url(/local/icons/weather_icons/animated/${weatherIcons[currentCondition]}.svg) no-repeat; background-size: contain;">${currentCondition}</span>
      <div class="dateTime">
          <div class="clock">${time}</div>
          <div class="date">${longDate}</div>
      </div>
      <span class="temp">${temperature}</span><span class="tempc"> ${getUnit('temperature')}</span>
      <span>
        <ul class="variations right">
            <li><span class="ha-icon"><ha-icon icon="mdi:water-percent"></ha-icon></span>${humidity}<span class="unit"> %</span></li>
            <li><span class="ha-icon"><ha-icon icon="mdi:gauge"></ha-icon></span>${pressure}<span class="unit"> ${getUnit('air_pressure')}</span></li>
        </ul>
        <ul class="variations">
            <li><span class="ha-icon"><ha-icon icon="mdi:weather-windy"></ha-icon></span>${windBearing} ${windSpeed}<span class="unit"> ${getUnit('length')}/h</span></li>
            <li><span class="ha-icon"><ha-icon icon="mdi:weather-fog"></ha-icon></span>${visibility}<span class="unit"> ${getUnit('length')}</span></li>
        </ul>
      </span>
      <div class="forecast clear">
          ${forecast.map((daily, index) => `
              <div class="day">
                  <span class="dayname">${(new Date(daily.datetime)).toString().split(' ')[0]}</span>
                  <br><i class="icon" style="background: none, url(/local/icons/weather_icons/animated/${getIcon(daily.condition, index)}.svg) no-repeat; background-size: contain;"></i>
                  <br><span class="highTemp">${daily.temperature}${getUnit('temperature')}</span>
                  <br><span class="lowTemp">${daily.templow}${getUnit('temperature')}</span>
              </div>`).join('')}
      </div>`;
  }

  setConfig(config) {
    if (!config.entity_weather || !config.entity_sun) {
      throw new Error('Please define entities');
    }
    this.config = config;
  }

  // @TODO: This requires more intelligent logic
  getCardSize() {
    return 3;
  }

}

customElements.define('weather-card', WeatherCard);
