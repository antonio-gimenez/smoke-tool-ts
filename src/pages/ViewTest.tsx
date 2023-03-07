import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TestAttachments from "../components/TestAttachments/TestAttachments";
import { TestContext } from "../contexts/TestContext";
import { ReactComponent as ArrowLeftIcon } from '../assets/icons/arrow-left.svg';
import { humanReadeableDate } from "../utils/file";
import useScrollState from "../hooks/useScrollState";
import NotFound from "./NotFound";
import { Tab, Tabs } from "../components/ui/Tabs";
function ViewTest() {
  const { id } = useParams();
  const { tests, fetch } = useContext(TestContext);
  const history = useNavigate();
  useEffect(() => {
    fetch({ id });
  }, [id]);

  const [isBodyScrolled] = useScrollState({
    initialState: false,
    axis: "y",
    offset: 20,
  });


  // return 404 if test is not found
  if (!tests?.length) {
    return <NotFound />
  }

  const today = new Date();

  return (
    <div className="container">
      <Tabs onClick={() => { }}>
        <Tab label="Test">
          <p>
            Test Summary
          </p>
        </Tab>
        <Tab label="Attachments">
          <TestAttachments test={tests[0]} />
        </Tab>
      </Tabs>
      <div className={`view-test-navigation ${isBodyScrolled ? 'is-scrolling' : ''}`}>
        <button className="button button-ghost " onClick={() => history(-1)}><ArrowLeftIcon className="icon-small text-primary" /> Back to list</button>
      </div>
      <section className="view-test-layout">
        <div className="view-test-section test-steps">
          <h1 className="view-test-section-title">Test Steps</h1>
          <div className="view-test-step">
            <h2 className="title"><span className="view-test-step-number" style={{ marginRight: '5px' }}>1</span>
              Emergency FW Update</h2>

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

          {tests?.map((test) => (
            <div key={test._id}>
              <p>Release: {test.release}</p>
              <p>Product: {test.product}</p>
              <p>Priority: {test.priority}</p>
              <p>Branch: {test.branch}</p>

              <TestAttachments test={test} />
              <div className="view-test-summary-section-name">Last Edit</div>
              <div className="view-test-summary-last-edit">
                <span className="view-test-summary-last-edit-date">{humanReadeableDate(today)}</span>
              </div>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
}

export default ViewTest;
