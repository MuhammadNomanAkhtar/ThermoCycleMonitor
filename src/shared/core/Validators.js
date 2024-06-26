export function emailValidator(email) {
    const regEmail =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email) return {value: email, error: 'Email is required'};
    if (!regEmail.test(email)) return {value: email, error: 'Email is invalid'};
    // if (!re.test(email)) return { value: email, error: "Ooops! We need a valid email address" }
    return {value: email, error: ''};
}

export function passwordValidator(password) {
    if (!password)
      return {value: password, error: 'Password is required'};
    return {value: password, error: ''};
}

export function deviceIdValidator(deviceId) {
    if (!deviceId)
      return {value: deviceId, error: 'Device Id is required'};
    return {value: deviceId, error: ''};
}

export function dateTimeValidator(dateTime) {
    if (!dateTime)
      return {value: dateTime, error: 'Date and Time is required'};
    return {value: dateTime, error: ''};
}

export function temperatureValidator(temp) {
    if (!temp)
      return {value: temp, error: 'Temperature is required'};
    else if(temp<0 || temp>500)
      return {value: temp, error: 'Enter Temperature between (0 - 500)'};
    return {value: temp, error: ''};
}

export function clinicalDeviceValidator(cDevice) {
    if (!cDevice)
      return {value: cDevice, error: 'Clinical Device Detail is required'};
    return {value: cDevice, error: ''};
}

export function timeValidator(time) {
    if (!time)
      return {value: time, error: 'Time is required'};
    else if(time<0 || time>60)
      return {value: time, error: 'Enter Time between (0 - 60)'};
    return {value: time, error: ''};
}

export function integerValidator(val) {
  let a = val.replace(/[^0-9]|-(?![0-9]+$)/g, '');
  return a;
}