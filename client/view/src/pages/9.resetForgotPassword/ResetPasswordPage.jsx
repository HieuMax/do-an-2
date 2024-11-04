import { useState } from "react";
import { useAuthStore } from "../../api/authStore";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/input/Input";
import { Lock } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ResetPasswordPage = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const { resetPassword, error, isLoading, message } = useAuthStore();

	const { token } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}
		try {
			await resetPassword(token, password);

			toast.success("Password reset successfully, redirecting to login page...");
			setTimeout(() => {
				navigate("/login");
			}, 1000);
		} catch (error) {
			console.error(error);
			toast.error(error.message || "Error resetting password");
		}
	};

	return (
		<div className="w-full bg-background-login bg-no-repeat bg-bottom bg-cover h-screen flex justify-center items-center">
			<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full bg-white bg-opacity-100 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
			>
				<div className='p-8'>
					<img alt="Logo" src="/view/src/assets/logo.webp" class="mx-auto h-10 w-auto my-6"/>
					<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-black to-slate-800 text-transparent bg-clip-text mt-8'>
						Đặt lại mật khẩu
					</h2>
					{error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
					{message && <p className='text-gray-500 text-sm mb-4'>{message}</p>}

					<form onSubmit={handleSubmit}>
						<p className='text-gray-500 mb-6 text-center'>
							Hãy điền mật khẩu mới cho tài khoản của bạn, hệ thống sẽ cập nhật lại tài khoản.
						</p>
						<Input
							icon={Lock}
							type='password'
							placeholder='Mật khẩu mới'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>

						<Input
							icon={Lock}
							type='password'
							placeholder='Xác nhận mật khẩu mới'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className='w-full py-3 px-4 bg-gradient-to-r bg-system text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
							type='submit'
							disabled={isLoading}
						>
							{isLoading ? "Resetting..." : "Thiết lập mật khẩu mới"}
						</motion.button>
					</form>
				</div>
			</motion.div>
		</div>
	);
};
export default ResetPasswordPage;