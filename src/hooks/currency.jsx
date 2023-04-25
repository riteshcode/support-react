const Currency = (symbol, amount) => {
  return symbol + "" + new Intl.NumberFormat("en-IN").format(amount);
};
export default Currency;
