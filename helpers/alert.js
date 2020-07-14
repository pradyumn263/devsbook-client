import { Alert } from "react-bootstrap";

export const showSuccessMessage = (success) => {
	return <Alert variant="success"> {success} </Alert>;
};

export const showErrorMessage = (err) => {
	return <Alert variant="danger">{err}</Alert>;
};
