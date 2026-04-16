export let copyText = (text: string) => {
  if (window.navigator.clipboard) {
    copyText = (text: string) => window.navigator.clipboard.writeText(text);
  } else {
    copyText = (text: string) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    };
  }
  copyText(text);
}
