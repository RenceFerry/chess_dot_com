export const generateOTP = (length: number) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return Math.floor((Math.random() * (max - min + 1)) + min);
}

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export const formatFollowers = (count: number) => {
  let formatted = count.toString();
  if (count > 1000) formatted = (count / 1000).toFixed(1) + 'K';
  else if (count > 1000000) formatted = (count / 1000000).toFixed(1) + 'M';
  else if (count > 1000000000) formatted = (count / 1000000000).toFixed(1) + 'B';

  return formatted;
}

export const insertSort = <T>(arr: T[], item: T, compareFn: (a: T, b: T) => number): T[] => {
  let lo = 0, hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (compareFn(arr[mid], item) < 0) lo = mid + 1;
    else hi = mid;
  }

  arr.splice(lo, 0, item);
  return arr;
}

export const getFirstName = (name: string) => {
  return name.split(' ')[0].split('_')[0].split('.')[0];
}