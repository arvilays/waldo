import { useEffect, useState } from "react";
import Status from "./Status";

export default function DelayedLoader({ show, title, description, type }) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timeout;

    if (show) {
      timeout = setTimeout(() => setShouldRender(true), 300); // delay by 300ms
    } else {
      setShouldRender(false);
    }

    return () => clearTimeout(timeout);
  }, [show]);

  return shouldRender ? (
    <Status title={title} description={description} type={type} />
  ) : null;
}