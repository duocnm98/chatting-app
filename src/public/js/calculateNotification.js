function decreaseNumberNotification(className) {
  let currentValue = +$(`.${className}`).text(); //conver to number
  currentValue -= 1;

  if (currentValue === 0) {
    $(`.${className}`).css("display", "none").html("");
  } else {
    $(`.${className}`).css("display", "block").html(currentValue);
  }
}

function increaseNumberNotification(className) {
  let currentValue = +$(`.${className}`).text(); //conver to number
  currentValue += 1;

  if (currentValue === 0) {
    $(`.${className}`).css("display", "none").html("");
  } else {
    $(`.${className}`).css("display", "block").html(currentValue);
  }
}
