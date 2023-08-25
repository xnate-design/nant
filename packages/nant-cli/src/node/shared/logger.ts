import po from 'picocolors';

export default {
  info(text: string): void {
    console.log(text);
  },
  success(text: string): void {
    console.log(po.green(text));
  },
  warning(text: string): void {
    console.log(po.yellow(text));
  },
  error(text: string): void {
    console.log(po.red(text));
  },
  title(text: string): void {
    console.log(po.cyan(text));
  },

  green(text: string): string {
    return po.green(text);
  },
};
