import React from "react";

const Card = ({ children }) => {
  if (!children) return console.error("Card component requires children");
  return <div className={`card`}>{children}</div>;
};

const CardHeader = ({ children }) => {
  return <div className="card-header">{children}</div>;
};

const CardContent = ({ children }) => {
  return <div className="card-content">{children}</div>;
};

const CardActions = ({ children }) => {
  return <div className="card-actions">{children}</div>;
};

const CardFooter = ({ children }) => {
  return <footer className="card-footer">{children}</footer>;
};

export { Card, CardContent, CardHeader, CardActions, CardFooter };

export default Card;
