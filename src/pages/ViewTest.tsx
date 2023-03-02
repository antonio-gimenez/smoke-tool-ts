import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TestAttachments from "../components/TestAttachments/TestAttachments";
import { TestContext } from "../contexts/TestContext";

function ViewTest() {
  const { id } = useParams();
  const { tests, fetch } = useContext(TestContext);
  const history = useNavigate();
  useEffect(() => {
    fetch({ id });
  }, [id]);


  return (
    <div>
      <button className="button button-primary" onClick={() => history(-1)}>Go Back</button>
      <section className="view">
        {tests?.map((test) => (
          <div key={test._id}>
            <span className="title">{test.name}</span>
            <p>Release: {test.release}</p>
            <p>Product: {test.product}</p>
            <p>Priority: {test.priority}</p>
            <p>Branch: {test.branch}</p>
            <TestAttachments test={test} />
          </div>
        ))}
      </section>
    </div>
  );
}

export default ViewTest;
