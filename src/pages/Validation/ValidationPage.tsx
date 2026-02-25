import React, { useEffect } from "react";
import { useHistory } from "react-router";

const ValidationPage: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    history.push("/customer");
  });

  return <></>;
};

export default ValidationPage;
