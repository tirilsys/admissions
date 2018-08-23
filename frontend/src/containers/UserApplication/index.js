import React, { Component } from "react";
import Moment from "react-moment";
import "moment/locale/nb";
Moment.globalLocale = "nb";

import Application from "src/components/Application";
import CollapseContainer from "src/containers/CollapseContainer";

import Wrapper from "./Wrapper";
import Name from "./Name";
import PriorityText from "./PriorityText";
import SmallDescription from "./SmallDescription";
import SmallDescriptionWrapper from "./SmallDescriptionWrapper";
import Header from "./Header";
import NumApplications from "./NumApplications";

class UserApplication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      committeeApplications: []
    };
  }

  componentWillMount() {
    const {
      user,
      text,
      committee_applications,
      time_sent,
      whichCommitteeLeader
    } = this.props;

    const CommitteeApplications = committee_applications.map(
      (application, i) => {
        if (application.committee.name.toLowerCase() == whichCommitteeLeader) {
          this.props.generateCSVData(
            user.full_name,
            user.email,
            user.username,
            time_sent,
            application.text
          );

          return (
            <Application
              key={user.username + "-" + i}
              text={application.text}
            />
          );
        }
      }
    );

    this.setState({ committeeApplications: CommitteeApplications });
  }

  getCommitteeApplications(committee) {}

  render() {
    const { user, text, time_sent, phone_number } = this.props;
    const { committeeApplications } = this.state;
    return (
      <Wrapper>
        <CollapseContainer
          header={
            <Header>
              <Name>{user.full_name}</Name>
            </Header>
          }
          content={
            <div>
              <Header>
                <SmallDescriptionWrapper>
                  <SmallDescription> Brukernavn </SmallDescription>
                  {user.username}
                </SmallDescriptionWrapper>
                <SmallDescriptionWrapper>
                  <SmallDescription> Tlf. </SmallDescription> {phone_number}
                </SmallDescriptionWrapper>
                <SmallDescriptionWrapper>
                  <SmallDescription> E-mail </SmallDescription> {user.email}
                </SmallDescriptionWrapper>
                <SmallDescriptionWrapper>
                  <SmallDescription> Sendt </SmallDescription>
                  <Moment format="dddd Do MMMM, \k\l. HH:mm">
                    {time_sent}
                  </Moment>
                </SmallDescriptionWrapper>
              </Header>
              {committeeApplications}
            </div>
          }
        />
      </Wrapper>
    );
  }
}

export default UserApplication;
