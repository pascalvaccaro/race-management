export const printUrl = (url: string) => {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.src = url;
  document.body.appendChild(iframe);

  window.onmessage = (message: MessageEvent) => {
    if (iframe.src.startsWith(message.origin) && message.data === 'done')
      document.body.removeChild(iframe);
  };
};
