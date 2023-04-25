function PushNotify(msg) {
  const showNotification = () => {
    // create a new notification
    const notification = new Notification(msg);

    // close the notification after 10 seconds
    setTimeout(() => {
      notification.close();
    }, 10 * 1000);
  };

  // show an error message
  const showError = () => {
    const error = document.querySelector(".error");
    error.style.display = "block";
    error.textContent = "You blocked the notifications";
  };

  // check notification permission
  let granted = false;

  if (Notification.permission === "granted") {
    granted = true;
  } else if (Notification.permission !== "denied") {
    let permission = Notification.requestPermission();
    granted = permission === "granted" ? true : false;
  }

  // show notification or error
  granted ? showNotification() : showError();

  return null;
}
export default PushNotify;
