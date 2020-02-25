import React, { useRef, useEffect, useState } from "react";
import { Form } from "@unform/web";
import { Scope, FormHandles } from "@unform/core";
import * as Yup from "yup";

import Input from "./components/Form/Input";

const initialData = {
  name: "André Coelho",
  email: "andrevrcoelho@hotmail.com",
  address: {
    city: "Jundiaí"
  }
};

function App() {
  const formRef = useRef<FormHandles>(null);

  useEffect(() => {
    setTimeout(() => {
      formRef.current?.setData({
        name: "André Coelho",
        email: "andrevrcoelho@hotmail.com"
      });
    }, 2000);
  }, []);

  async function handleSubmit(data: any, { reset }: any) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Digite o nome"),
        email: Yup.string()
          .email("Digite um e-mail valido")
          .required("Digite o email"),
        address: Yup.object().shape({
          city: Yup.string()
            .min(3, "No minimo 3 caracteres")
            .required("Digite a cidade")
        })
      });

      await schema.validate(data, { abortEarly: false });

      reset();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages: any = {};

        err.inner.forEach((error: any) => {
          errorMessages[error.path] = error.message;
        });

        formRef.current?.setErrors(errorMessages);
      }
    }
  }

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <Input name="name" />
      <Input name="email" />

      <Scope path="address">
        <Input name="street" />
        <Input name="neighborhood" />
        <Input name="city" />
        <Input name="state" />
        <Input name="number" type="tel" />
      </Scope>
      <button type="submit">Enviar</button>
    </Form>
  );
}

export default App;
