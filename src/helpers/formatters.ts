import moment from "moment";

export const priceFormatter = (price: number): string => {
  return new Intl.NumberFormat("ru-RU").format(price);
};

export const dateFormatter = (date:string | undefined, format:string) :string =>{
  return moment(date).format(format);
}