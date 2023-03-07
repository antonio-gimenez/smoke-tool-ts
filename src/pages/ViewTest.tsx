import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as ArrowLeftIcon } from '../assets/icons/arrow-left.svg';
import TestAttachments from "../components/TestAttachments/TestAttachments";
import { TestContext } from "../contexts/TestContext";
import useScrollState from "../hooks/useScrollState";
import { humanReadeableDate } from "../utils/file";

function ViewTest() {
  const { id } = useParams();
  const { tests, fetch } = useContext(TestContext);
  const navigate = useNavigate();
  useEffect(() => {

    fetch({ id });
  }, [id]);

  const [isBodyScrolled] = useScrollState({
    initialState: false,
    axis: "y",
    offset: 20,
  });

  if (!id || tests?.length > 1) return <div className="container">
    <span className="loading" />
  </div>;

  return (
    <div className="container">
      <div className={`test-view-navigation ${isBodyScrolled ? 'is-scrolling' : ''}`}>
        <button className="button button-ghost " onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="icon-small text-primary" /> Back to list
        </button>
      </div>
      <section className="view-test-layout">
        <div className="view-test-section test-steps">
          <h1 className="view-test-section-title">Test Steps</h1>
          <div className="view-test-step">
            <h2 className="title">
              <span className="view-test-step-number" style={{ marginRight: '5px' }}>1</span>
              Emergency FW Update
            </h2>

            <div className="view-test-step-description">
              <p>Install FW into the CS via USB</p>
            </div>
            <div className="view-test-step-expected-result">
              <p>Expected result: <span>CS should be updated</span></p>
            </div>
          </div>
        </div>
        <div className="view-test-section test-summary">
          <h1 className="view-test-section-title">Test Summary</h1>

          {!tests && <div>Loading...</div>}

          {tests?.map((test) => (
            <div key={test._id}>
              <p>Release: {test.release}</p>
              <p>Product: {test.product}</p>
              <p>Priority: {test.priority}</p>
              <p>Branch: {test.branch}</p>

              <TestAttachments test={test} />
              <div className="view-test-summary-section-name">Last Edit</div>
              <div className="view-test-summary-last-edit">
                <span className="view-test-summary-last-edit-date">{humanReadeableDate(new Date())}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ViewTest;
