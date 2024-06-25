import { Container, ContainerSucces } from "./styles";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import validator from "validator";

export function Form() {
  interface FormState {
    succeeded: boolean;
    submitting: boolean;
    errors: string[];
  }

  const [state, setState] = useState<FormState>({
    succeeded: false,
    submitting: false,
    errors: [],
  });
  const [validEmail, setValidEmail] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  function verifyEmail(email: string) {
    if (validator.isEmail(email)) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  }

  useEffect(() => {
    if (state.succeeded) {
      toast.success("Email successfully sent!", {
        position: toast.POSITION.BOTTOM_LEFT,
        pauseOnFocusLoss: false,
        closeOnClick: true,
        hideProgressBar: false,
        toastId: "succeeded",
      });
    }
  }, [state.succeeded]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ ...state, submitting: true });

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", (event.target as HTMLFormElement).email.value);
    formData.append("message", message);
    formData.append("phone_number", phoneNumber);
    formData.append("access_key", "9305e71b-eb91-4f23-8274-b47122e0785f");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setState({ succeeded: true, submitting: false, errors: [] });
        (event.target as HTMLFormElement).reset();
      } else {
        console.error("Error", data);
        setState({
          succeeded: false,
          submitting: false,
          errors: [data.message],
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setState({
        succeeded: false,
        submitting: false,
        errors: ["An error occurred"],
      });
    }
  };

  if (state.succeeded) {
    return (
      <ContainerSucces>
        <h3>Thanks for getting in touch!</h3>
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Back to the top
        </button>
        <ToastContainer />
      </ContainerSucces>
    );
  }

  return (
    <Container>
      <h2>Get in touch using the form</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          id="name"
          type="text"
          name="name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Email"
          id="email"
          type="email"
          name="email"
          onChange={(e) => verifyEmail(e.target.value)}
          required
        />
        <input
          placeholder="Phone Number"
          id="phone_number"
          type="text"
          name="phone_number"
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <textarea
          required
          placeholder="Send a message to get started."
          id="message"
          name="message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          disabled={
            state.submitting || !validEmail || !message || !name || !phoneNumber
          }
        >
          Submit
        </button>
      </form>
      <ToastContainer />
    </Container>
  );
}
