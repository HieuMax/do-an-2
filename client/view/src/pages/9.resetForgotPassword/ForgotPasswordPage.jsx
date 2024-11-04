import { useState } from "react";
import { useAuthStore } from "../../api/authStore";
import Input from "../../components/input/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const { isLoading, forgotPassword } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await forgotPassword(email);
		setIsSubmitted(true);
	};

	return (
		<div className="w-full  bg-background-login bg-no-repeat bg-bottom bg-cover h-screen flex justify-center items-center">

			<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='max-w-md w-full bg-white bg-opacity-100 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
			>
				<div className='p-8'>
					<img alt="Logo" src="/view/src/assets/logo.webp" class="mx-auto h-10 w-auto my-6"/>
					<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-black to-slate-800 text-transparent bg-clip-text mt-8'>
						Quên mật khẩu
					</h2>

					{!isSubmitted ? (
						<form onSubmit={handleSubmit}>
							<p className='text-gray-500 mb-6 text-center'>
			
								Hãy nhập vào địa chỉ email của bạn, chúng tôi sẽ gửi link để đặt lại mật khẩu.
							</p>
							<Input
								icon={Mail}
								type='email'
								placeholder='Email Address'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className='w-full py-3 px-4 bg-gradient-to-r bg-system text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
								type='submit'
							>
								{isLoading ? <Loader className='size-6 animate-spin mx-auto' /> : "Gửi Reset Link"}
							</motion.button>
						</form>
					) : (
						<div className='text-center'>
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ type: "spring", stiffness: 500, damping: 30 }}
								className='w-16 h-16 bg-system rounded-full flex items-center justify-center mx-auto mb-4'
							>
								<Mail className='h-8 w-8 text-white' />
							</motion.div>
							<p className='text-gray-500 mb-6'>
								Nếu có tải khoản {email} tồn tại, bạn sẽ sớm nhận được link đặt lại mật khẩu.
							</p>
						</div>
					)}
				</div>

				<div className='px-8 py-4 bg-slate-700 bg-opacity-1 flex justify-center'>
					<Link to={"/login"} className='text-sm text-white hover:underline flex items-center'>
						<ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
					</Link>
				</div>
			</motion.div>

		</div>
	);
};
export default ForgotPasswordPage;