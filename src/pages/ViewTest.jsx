import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TestContext } from "../contexts/TestContext";

function ViewTest() {
  const { id } = useParams();
  const { tests, fetch } = useContext(TestContext);

  useEffect(() => {
    fetch({ id });
  }, [id]);

  return (
    <div>
      <h1>Test Number: {id}</h1>
      <section className="view">
        {tests?.map((test) => {
          return (
            <div key={test.id}>
              <h2>{test.name}</h2>
              <p>{test.description}</p>
              <p>{test.status}</p>
              <p>{test.created_at}</p>
              <p>{test.files.length}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default ViewTest;
