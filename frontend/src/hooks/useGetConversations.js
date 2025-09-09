import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setConversations } from "../store";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/users");
				const data = await res.json();
				if (data.error) {
					throw new Error(data.error);
				}
				dispatch(setConversations(data));
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, [dispatch]);

	return { loading };
};
export default useGetConversations;
