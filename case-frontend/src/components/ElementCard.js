function ElementCard({ children, type = "card", ...props }) {
  return (
    <div {...props} className={`element-${type}`}>
      {children}
    </div>
  );
}

export default ElementCard;
