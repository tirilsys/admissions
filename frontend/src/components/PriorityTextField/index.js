import React, { Component } from "react";
import Textarea from "react-textarea-autosize";

import { Card, CardTitle } from "src/components/Card";

import "./style.css";

class PriorityTextField extends Component {
  componentDidMount() {
    this.setState({
      timeout: setInterval(() => {
        sessionStorage.setItem("text", this.props.field.value);
      }, 4000)
    });
  }
  componentWillUnmount() {
    clearInterval(this.state.timeout);
  }
  render() {
    const {
      field: { name, onChange, value },
      form: { handleBlur }
    } = this.props;
    return (
      <Wrapper>
        <Card className="input" margin="0.5rem 1rem">
          <CardTitle margin="0.5rem" fontSize="0.8em">
            Her kan du rangere komiteer etter ønske, og komme med andre
            kommentarer.
          </CardTitle>
          <Textarea
            className="textarea"
            type="textarea"
            name={name}
            id={name}
            onChange={onChange}
            onBlur={handleBlur}
            placeholder="Skriv dine kommentarer her..."
            value={value}
            rows="10"
          />
        </Card>
      </Wrapper>
    );
  }
}

export default PriorityTextField;
