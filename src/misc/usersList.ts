export function sortingUsersList(list: string): string[] {
  const newArray: string[] = [];
  const splitingList = list.split("\n");
  splitingList.forEach((user) => {
    newArray.push(user.toLowerCase());
  });
  return newArray;
}
