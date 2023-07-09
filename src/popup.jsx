import React, { useState, useEffect } from "react";
import { render } from "react-dom";

const popupStyle = {
  maxWidth: "900px",
  maxHeight: "900px",
  margin: "20px auto",
  padding: "20px",
  background: "rgb(131,58,180)",
  background: "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%)",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  fontFamily: "Arial, sans-serif",
};

const activePopupStyle = {
  ...popupStyle,
  border: "2px solid #4CAF50",
};

const headingStyle = {
  fontSize: "24px",
  color: "#333333",
  marginBottom: "10px",
};

const paragraphStyle = {
  fontSize: "16px",
  color: "#666666",
  marginBottom: "20px",
};

const formStyle = {
  marginBottom: "20px",
};

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: "10px",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #cccccc",
  borderRadius: "4px",
};

const buttonStyle = {
  display: "inline-block",
  padding: "10px 15px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "16px",
  textDecoration: "none",
  backgroundColor: "#4CAF50",
  color: "#ffffff",
  marginRight: "10px",
};

const buttonListStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
};

const buttonListItemStyle = {
  marginBottom: "10px",
};

const currencyCheckerStyle = {
  fontSize: "14px",
  marginTop: "20px",
};

function ButtonForm({ addNewButton }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const { label, url } = event.target.elements;
    addNewButton(label.value, url.value);
    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <input
        type="text"
        name="label"
        placeholder="Button Label"
        required
        style={inputStyle}
      />
      <input
        type="url"
        name="url"
        placeholder="Button URL"
        required
        style={inputStyle}
      />
      <button type="submit" style={buttonStyle}>
        Add Button
      </button>
    </form>
  );
}

function ButtonList({ buttons, handleButtonClick, deleteButton }) {
  return (
    <div style={buttonListStyle}>
      {buttons.map((button, index) => (
        <div key={index} style={buttonListItemStyle}>
          <button
            onClick={() => handleButtonClick(button.url)}
            style={buttonStyle}
          >
            {button.label}
          </button>
          <button
            onClick={() => deleteButton(index)}
            style={{ ...buttonStyle, backgroundColor: "#ff0000" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

function CurrencyChecker() {
  const [exchangeRates, setExchangeRates] = useState(null);
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [convertedCurrency, setConvertedCurrency] = useState("");
  const [conversionResult, setConversionResult] = useState("");

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
      );
      const data = await response.json();
      setExchangeRates(data.rates);
    } catch (error) {
      console.log("Error fetching exchange rates:", error);
    }
  };

  const handleCurrencyConversion = (event) => {
    event.preventDefault();

    if (!exchangeRates) {
      return;
    }

    const rate = exchangeRates[convertedCurrency];
    if (!rate) {
      return;
    }

    const amount = event.target.elements.amount.value;
    const result = amount * rate;
    setConversionResult(`${amount} ${baseCurrency} = ${result} ${convertedCurrency}`);
  };

  return (
    <div style={currencyCheckerStyle}>
      <h3>Currency Checker</h3>
      <form onSubmit={handleCurrencyConversion}>
        <label htmlFor="amount">Amount:</label>
        <input type="number" id="amount" name="amount" required />
        <label htmlFor="baseCurrency">From:</label>
        <select
          id="baseCurrency"
          name="baseCurrency"
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
        <label htmlFor="convertedCurrency">To:</label>
        <select
          id="convertedCurrency"
          name="convertedCurrency"
          value={convertedCurrency}
          onChange={(e) => setConvertedCurrency(e.target.value)}
        >
          <option value="">Select Currency</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
        <button type="submit" style={buttonStyle}>
          Convert
        </button>
      </form>
      {conversionResult && <p>{conversionResult}</p>}
    </div>
  );
}

function Popup() {
  const [isActive, setIsActive] = useState(false);
  const [buttons, setButtons] = useState([]);

  useEffect(() => {
    const storedButtons = localStorage.getItem("buttons");
    if (storedButtons) {
      setButtons(JSON.parse(storedButtons));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("buttons", JSON.stringify(buttons));
  }, [buttons]);

  const addNewButton = (label, url) => {
    setButtons([...buttons, { label, url }]);
  };

  const handleButtonClick = (url) => {
    window.open(url, "_blank");
  };

  const deleteButton = (index) => {
    const updatedButtons = [...buttons];
    updatedButtons.splice(index, 1);
    setButtons(updatedButtons);
  };

  const handlePopupClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div
      style={isActive ? activePopupStyle : popupStyle}
      onClick={handlePopupClick}
    >
      <h1 style={headingStyle}>CurrMark</h1>
      <p style={paragraphStyle}>Easy Saves. Easy Change!</p>
      <ButtonForm addNewButton={addNewButton} />
      <ButtonList
        buttons={buttons}
        handleButtonClick={handleButtonClick}
        deleteButton={deleteButton}
      />
      <CurrencyChecker />
    </div>
  );
}

render(<Popup />, document.getElementById("react-target"));


/*import React, { useState, useEffect } from "react";
import { render } from "react-dom";

const popupStyle = {
  maxWidth: "400px",
  margin: "20px auto",
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  fontFamily: "Arial, sans-serif",
};

const activePopupStyle = {
  ...popupStyle,
  border: "2px solid #4CAF50",
};

const headingStyle = {
  fontSize: "24px",
  color: "#333333",
  marginBottom: "10px",
};

const paragraphStyle = {
  fontSize: "16px",
  color: "#666666",
  marginBottom: "20px",
};

const formStyle = {
  marginBottom: "20px",
};

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: "10px",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #cccccc",
  borderRadius: "4px",
};

const buttonStyle = {
  display: "inline-block",
  padding: "10px 20px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "16px",
  textDecoration: "none",
  backgroundColor: "#4CAF50",
  color: "#ffffff",
  marginRight: "10px",
};

const buttonListStyle = {
  display: "flex",
  flexWrap: "wrap",
};

const buttonListItemStyle = {
  marginBottom: "10px",
};

function ButtonForm({ addNewButton }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const { label, url } = event.target.elements;
    addNewButton(label.value, url.value);
    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <input
        type="text"
        name="label"
        placeholder="Button Label"
        required
        style={inputStyle}
      />
      <input
        type="url"
        name="url"
        placeholder="Button URL"
        required
        style={inputStyle}
      />
      <button type="submit" style={buttonStyle}>
        Add Button
      </button>
    </form>
  );
}

function ButtonList({ buttons, handleButtonClick, deleteButton }) {
  return (
    <div style={buttonListStyle}>
      {buttons.map((button, index) => (
        <div key={index} style={buttonListItemStyle}>
          <button
            onClick={() => handleButtonClick(button.url)}
            style={buttonStyle}
          >
            {button.label}
          </button>
          <button
            onClick={() => deleteButton(index)}
            style={{ ...buttonStyle, backgroundColor: "#ff0000" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

function Popup() {
  const [isActive, setIsActive] = useState(false);
  const [buttons, setButtons] = useState([]);

  useEffect(() => {
    const storedButtons = localStorage.getItem("buttons");
    if (storedButtons) {
      setButtons(JSON.parse(storedButtons));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("buttons", JSON.stringify(buttons));
  }, [buttons]);

  const addNewButton = (label, url) => {
    setButtons([...buttons, { label, url }]);
  };

  const handleButtonClick = (url) => {
    window.open(url, "_blank");
  };

  const deleteButton = (index) => {
    const updatedButtons = [...buttons];
    updatedButtons.splice(index, 1);
    setButtons(updatedButtons);
  };

  const handlePopupClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div
      style={isActive ? activePopupStyle : popupStyle}
      onClick={handlePopupClick}
    >
      <h1 style={headingStyle}>Hello World</h1>
      <p style={paragraphStyle}>I am him</p>
      <ButtonForm addNewButton={addNewButton} />
      <ButtonList
        buttons={buttons}
        handleButtonClick={handleButtonClick}
        deleteButton={deleteButton}
      />
    </div>
  );
}

render(<Popup />, document.getElementById("react-target"));
*/


/*import React, { useState, useEffect } from "react";
import { render } from "react-dom";

const popupStyle = {
  maxWidth: "400px",
  margin: "20px auto",
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  fontFamily: "Arial, sans-serif",
};

const headingStyle = {
  fontSize: "24px",
  color: "#333333",
  marginBottom: "10px",
};

const paragraphStyle = {
  fontSize: "16px",
  color: "#666666",
  marginBottom: "20px",
};

const formStyle = {
  marginBottom: "20px",
};

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: "10px",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #cccccc",
  borderRadius: "4px",
};

const buttonStyle = {
  display: "inline-block",
  padding: "10px 20px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "16px",
  textDecoration: "none",
  backgroundColor: "#4CAF50",
  color: "#ffffff",
  marginRight: "10px",
};

const buttonListStyle = {
  display: "flex",
  flexWrap: "wrap",
};

const buttonListItemStyle = {
  marginBottom: "10px",
};

function ButtonForm({ addNewButton }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const { label, url } = event.target.elements;
    addNewButton(label.value, url.value);
    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <input
        type="text"
        name="label"
        placeholder="Button Label"
        required
        style={inputStyle}
      />
      <input
        type="url"
        name="url"
        placeholder="Button URL"
        required
        style={inputStyle}
      />
      <button type="submit" style={buttonStyle}>
        Add Button
      </button>
    </form>
  );
}

function ButtonList({ buttons, handleButtonClick, deleteButton }) {
  return (
    <div style={buttonListStyle}>
      {buttons.map((button, index) => (
        <div key={index} style={buttonListItemStyle}>
          <button
            onClick={() => handleButtonClick(button.url)}
            style={buttonStyle}
          >
            {button.label}
          </button>
          <button
            onClick={() => deleteButton(index)}
            style={{ ...buttonStyle, backgroundColor: "#ff0000" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

function Popup() {
  const [buttons, setButtons] = useState([]);

  useEffect(() => {
    const storedButtons = localStorage.getItem("buttons");
    if (storedButtons) {
      setButtons(JSON.parse(storedButtons));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("buttons", JSON.stringify(buttons));
  }, [buttons]);

  const addNewButton = (label, url) => {
    setButtons([...buttons, { label, url }]);
  };

  const handleButtonClick = (url) => {
    window.open(url, "_blank");
  };

  const deleteButton = (index) => {
    const updatedButtons = [...buttons];
    updatedButtons.splice(index, 1);
    setButtons(updatedButtons);
  };

  return (
    <div style={popupStyle}>
      <h1 style={headingStyle}>Hello World</h1>
      <p style={paragraphStyle}>I am him</p>
      <ButtonForm addNewButton={addNewButton} />
      <ButtonList
        buttons={buttons}
        handleButtonClick={handleButtonClick}
        deleteButton={deleteButton}
      />
    </div>
  );
}

render(<Popup />, document.getElementById("react-target"));
*/


/*import React, { useState, useEffect } from "react";
import { render } from "react-dom";

const popupStyle = {
  maxWidth: "400px",
  margin: "20px auto",
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  fontFamily: "Arial, sans-serif",
};

const headingStyle = {
  fontSize: "24px",
  color: "#333333",
  marginBottom: "10px",
};

const paragraphStyle = {
  fontSize: "16px",
  color: "#666666",
  marginBottom: "20px",
};

const formStyle = {
  marginBottom: "20px",
};

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: "10px",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #cccccc",
  borderRadius: "4px",
};

const buttonStyle = {
  display: "inline-block",
  padding: "10px 20px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "16px",
  textDecoration: "none",
  backgroundColor: "#4CAF50",
  color: "#ffffff",
  marginRight: "10px",
};

const buttonListStyle = {
  display: "flex",
  flexWrap: "wrap",
};

const buttonListItemStyle = {
  marginBottom: "10px",
};

function ButtonForm({ addNewButton }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const { label, url } = event.target.elements;
    addNewButton(label.value, url.value);
    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <input
        type="text"
        name="label"
        placeholder="Button Label"
        required
        style={inputStyle}
      />
      <input
        type="url"
        name="url"
        placeholder="Button URL"
        required
        style={inputStyle}
      />
      <button type="submit" style={buttonStyle}>
        Add Button
      </button>
    </form>
  );
}

function ButtonList({ buttons, handleButtonClick }) {
  return (
    <div style={buttonListStyle}>
      {buttons.map((button, index) => (
        <div key={index} style={buttonListItemStyle}>
          <button
            onClick={() => handleButtonClick(button.url)}
            style={buttonStyle}
          >
            {button.label}
          </button>
        </div>
      ))}
    </div>
  );
}

function Popup() {
  const [buttons, setButtons] = useState([]);

  useEffect(() => {
    const storedButtons = localStorage.getItem("buttons");
    if (storedButtons) {
      setButtons(JSON.parse(storedButtons));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("buttons", JSON.stringify(buttons));
  }, [buttons]);

  const addNewButton = (label, url) => {
    setButtons([...buttons, { label, url }]);
  };

  const handleButtonClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div style={popupStyle}>
      <h1 style={headingStyle}>Hello World</h1>
      <p style={paragraphStyle}>I am him</p>
      <ButtonForm addNewButton={addNewButton} />
      <ButtonList
        buttons={buttons}
        handleButtonClick={handleButtonClick}
      />
    </div>
  );
}

render(<Popup />, document.getElementById("react-target"));
*/


/*import React, { useState, useEffect } from "react";
import { render } from "react-dom";

function ButtonForm({ addNewButton }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const { label, url } = event.target.elements;
    addNewButton(label.value, url.value);
    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="label" placeholder="Button Label" required />
      <input type="url" name="url" placeholder="Button URL" required />
      <button type="submit">Add Button</button>
    </form>
  );
}

function ButtonList({ buttons, handleButtonClick }) {
  return (
    <div>
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(button.url)}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}

function Popup() {
  const [buttons, setButtons] = useState([]);

  useEffect(() => {
    const storedButtons = localStorage.getItem("buttons");
    if (storedButtons) {
      setButtons(JSON.parse(storedButtons));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("buttons", JSON.stringify(buttons));
  }, [buttons]);

  const addNewButton = (label, url) => {
    setButtons([...buttons, { label, url }]);
  };

  const handleButtonClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div>
      <h1>Hello World</h1>
      <p>I am him</p>
      <ButtonForm addNewButton={addNewButton} />
      <ButtonList
        buttons={buttons}
        handleButtonClick={handleButtonClick}
      />
    </div>
  );
}

render(<Popup />, document.getElementById("react-target"));
*/

/*import React, { useState, useContext } from "react";
import { render } from "react-dom";

const ButtonContext = React.createContext();

function ButtonProvider({ children }) {
  const [buttons, setButtons] = useState([]);

  const addNewButton = (label, url) => {
    setButtons([...buttons, { label, url }]);
  };

  return (
    <ButtonContext.Provider value={{ buttons, addNewButton }}>
      {children}
    </ButtonContext.Provider>
  );
}

function ButtonForm() {
  const { addNewButton } = useContext(ButtonContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    const { label, url } = event.target.elements;
    addNewButton(label.value, url.value);
    event.target.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="label" placeholder="Button Label" required />
      <input type="url" name="url" placeholder="Button URL" required />
      <button type="submit">Add Button</button>
    </form>
  );
}

function ButtonList() {
  const { buttons } = useContext(ButtonContext);

  const handleButtonClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div>
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(button.url)}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}

function Popup() {
  return (
    <div>
      <h1>Hello World</h1>
      <p>I am him</p>
      <ButtonForm />
      <ButtonList />
    </div>
  );
}

render(
  <ButtonProvider>
    <Popup />
  </ButtonProvider>,
  document.getElementById("react-target")
);
*/


/*import React from "react";
import { render } from "react-dom";

const containerStyle = {
  maxWidth: "400px",
  margin: "20px auto",
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
};

const headingStyle = {
  fontSize: "24px",
  color: "#333333",
  marginBottom: "10px"
};

const paragraphStyle = {
  fontSize: "16px",
  color: "#666666",
  marginBottom: "20px"
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center"
};

const buttonStyle = {
  display: "inline-block",
  padding: "10px 20px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "16px",
  textDecoration: "none"
};

const primaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#4CAF50",
  color: "#ffffff",
  marginRight: "10px"
};

const secondaryButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#ffffff",
  color: "#4CAF50",
  marginRight: "10px",
  border: "1px solid #4CAF50"
};

function Popup() {
  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Hello World</h1>
      <p style={paragraphStyle}>I am him</p>
      <div style={buttonContainerStyle}>
        <a href="https://chat.openai.com/" target="_blank" style={primaryButtonStyle}>
          ChatGPT
        </a>
        <a href="https://discord.com/channels/698366411864670250/1118750128266825768" target="_blank" style={secondaryButtonStyle}>
          Discord
        </a>
        <a href="https://www.youtube.com/" target="_blank" style={secondaryButtonStyle}>
          Youtube
        </a>
      </div>
    </div>
  );
}

render(<Popup />, document.getElementById("react-target"));
*/
