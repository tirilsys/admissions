import React from "react";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { useCreateApplicationMutation } from "src/query/mutations";

import GroupApplication from "src/containers/GroupApplication";

import FormStructure from "./FormStructure";

// State of the form
const FormContainer = ({
  admission,
  touched,
  errors,
  isSubmitting,
  groups,
  selectedGroups,
  handleSubmit,
  isValid,
  toggleGroup,
  toggleIsEditing,
  myApplication,
  isEditingApplication,
}) => {
  const onCancelEdit = () => {
    toggleIsEditing();
  };

  const hasSelected =
    groups.filter((group) => selectedGroups[group.name.toLowerCase()]).length >=
    1;
  const SelectedGroupItems = groups
    .filter((group) => selectedGroups[group.name.toLowerCase()])
    .map((group, index) => (
      <Field
        component={GroupApplication}
        group={group}
        name={group.name.toLowerCase()}
        responseLabel={group.response_label}
        error={
          touched[group.name.toLowerCase()] && errors[group.name.toLowerCase()]
        }
        key={`${group.name.toLowerCase()} ${index}`}
        disabled={!isEditingApplication}
      />
    ));

  // This is where the actual form structure comes in.
  return (
    <FormStructure
      {...{
        admission,
        isSubmitting,
        isValid,
        handleSubmit,
        groups,
        selectedGroups,
        toggleGroup,
        toggleIsEditing,
        myApplication,
      }}
      hasSelected={hasSelected}
      SelectedGroupItems={SelectedGroupItems}
      isEditing={isEditingApplication}
      onCancel={onCancelEdit}
    />
  );
};

// Highest order component for application form.
// Handles form values, submit post and form validation.
const ApplicationForm = ({
  myApplication,
  selectedGroups,
  toggleGroup,
  toggleIsEditing,
  admission,
  groups,
  isEditingApplication,
}) => {
  const createApplicationMutation = useCreateApplicationMutation();

  const {
    text = sessionStorage.getItem("text") || "",
    phone_number = sessionStorage.getItem("phoneNumber") || "",
    group_applications = [],
  } = myApplication || {};

  const blankGroupApplications = {};
  Object.keys(selectedGroups).forEach((group) => {
    blankGroupApplications[group] = "";
  });

  const groupApplications = group_applications.reduce(
    (obj, application) => ({
      ...obj,
      [application.group.name.toLowerCase()]: application.text,
    }),
    {}
  );

  const initialValues = {
    priorityText: text,
    phoneNumber: phone_number,
    ...blankGroupApplications,
    ...groupApplications,
  };

  return (
    <Formik
      initialValues={initialValues}
      validateOnChange={true}
      enableReinitialize={true}
      validationSchema={() => {
        return Yup.lazy(() => {
          // Iterate over all selected groups and add them to the required schema
          const schema = {};
          Object.entries(selectedGroups)
            .filter(([, isSelected]) => isSelected)
            .map(([name]) => name)
            .forEach((name) => {
              schema[name] = Yup.string().required(
                "Søknadsteksten må fylles ut"
              );
            });
          // Require phoneNumber with given structure to be set
          schema.phoneNumber = Yup.string("Skriv inn et norsk telefonnummer")
            .matches(
              /^(0047|\+47|47)?(?:\s*\d){8}$/,
              "Skriv inn et gyldig norsk telefonnummer"
            )
            .required("Skriv inn et gyldig norsk telefonnummer");
          return Yup.object().shape(schema);
        });
      }}
      onSubmit={(values, { setSubmitting }) => {
        const submission = {
          text: values.priorityText,
          applications: {},
          phone_number: values.phoneNumber,
        };
        Object.keys(values)
          .filter((group) => selectedGroups[group])
          .forEach((name) => {
            submission.applications[name] = values[name];
          });
        createApplicationMutation.mutate(
          { newApplication: submission },
          {
            onSuccess: () => {
              setSubmitting(false);
              toggleIsEditing();
              window.__DJANGO__.user.has_application = true;
            },
            onError: () => {
              alert("Det skjedde en feil.... ");
              setSubmitting(false);
            },
          }
        );
      }}
    >
      {
        (formikProps) => (
          <FormContainer
            {...formikProps}
            {...{
              admission,
              groups,
              selectedGroups,
              toggleGroup,
              toggleIsEditing,
              myApplication,
              isEditingApplication,
            }}
          />
        )
        // https://formik.org/docs/api/formik#props-1
      }
    </Formik>
  );
};

export default ApplicationForm;
