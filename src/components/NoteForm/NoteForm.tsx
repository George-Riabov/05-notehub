import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";

interface NoteFormValues {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

interface NoteFormProps {
  onSubmit: (values: NoteFormValues) => void;
}

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const validationSchema = Yup.object({
  title: Yup.string().min(3).max(50).required(),
  content: Yup.string().min(5).max(500).required(),
  tag: Yup.string().required(),
});

export default function NoteForm({ onSubmit }: NoteFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, actions) => {
        onSubmit(values);
        actions.resetForm();
      }}
    >
      {({ errors, touched }) => (
        <Form className={css.form}>
          <label className={css.label}>
            Title
            <Field name="title" className={css.input} />
            {touched.title && errors.title && (
              <span className={css.error}>{errors.title}</span>
            )}
          </label>

          <label className={css.label}>
            Content
            <Field
              as="textarea"
              name="content"
              rows={4}
              className={css.textarea}
            />
            {touched.content && errors.content && (
              <span className={css.error}>{errors.content}</span>
            )}
          </label>

          <label className={css.label}>
            Tag
            <Field as="select" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
          </label>

          <button type="submit" className={css.button}>
            Add note
          </button>
        </Form>
      )}
    </Formik>
  );
}
