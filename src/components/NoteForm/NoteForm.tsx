import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createNote } from "../../services/noteService";
import type { NoteTag } from "../../types/note";

import css from "./NoteForm.module.css";

const TAGS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

interface FormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .max(100, "Max 100 characters"),
  content: Yup.string().max(500, "Max 500 characters").notRequired(),
  tag: Yup.mixed<NoteTag>()
    .oneOf(TAGS, "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created");
      onCancel();
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  return (
    <Formik<FormValues>
      initialValues={{
        title: "",
        content: "",
        tag: "Todo",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => mutation.mutate(values)}
    >
      <Form className={css.form}>
        <label className={css.label}>
          Title
          <Field name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </label>

        <label className={css.label}>
          Content
          <Field as="textarea" name="content" className={css.textarea} />
          <ErrorMessage name="content" component="span" className={css.error} />
        </label>

        <label className={css.label}>
          Tag
          <Field as="select" name="tag" className={css.select}>
            {TAGS.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </label>

        <div className={css.actions}>
          <button type="button" className={css.cancel} onClick={onCancel}>
            Cancel
          </button>

          <button
            type="submit"
            className={css.submit}
            disabled={mutation.isPending}
          >
            Add note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
