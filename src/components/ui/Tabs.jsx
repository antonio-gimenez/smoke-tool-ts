import React, { useState } from "react";

const Tab = ({ label, children }) => {
  return <div label={label}>{children}</div>;
};

const Tabs = ({ children, active = 0, onClick }) => {
  const [activeTab, setActiveTab] = useState(active);

  const onClickTabItem = (tab) => {
    setActiveTab(tab);
    onClick && onClick(children[tab].props.label);
  };

  const TabList = ({ children, activeTab, onClickTabItem }) => {
    return (
      <ul className="tab-list">
        {React.Children.map(children, (child, index) => {
          return (
            <li className={`tab-list-item ${activeTab === index ? "tab-list-item-active " : ""}`}>
              <button
                className="tab-button "
                onClick={() => onClickTabItem(index)}
                role="tab"
                aria-selected={activeTab === index}
                tabIndex={activeTab === index ? 0 : -1}
              >
                {child.props.label}
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  const TabContent = ({ children, activeTab }) => {
    return (
      <div className="tab-content">
        {React.Children.map(children, (child, index) => {
          return (
            <div
              id={`headlessui-tabs-panel-${index}`}
              className={`tab-content-item ${activeTab === index ? "tab-content-item-active" : ""}`}
              role="tabpanel"
            >
              {activeTab === index && child}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="tabs-container">
      <TabList activeTab={activeTab} onClickTabItem={onClickTabItem}>
        {children}
      </TabList>
      <TabContent activeTab={activeTab}>{children}</TabContent>
    </div>
  );
};

export default Object.assign(Tabs, { Tab });
