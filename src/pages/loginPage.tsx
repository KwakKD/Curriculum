import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm/loginForm";
import { Link } from "react-router-dom";
import styles from './loginPage.module.css'
import Logo from "../components/Logo/logo";
import supabase from "../lib/supabaseClient";
import { useAuthStore } from "../store/authStore";

function LoginPage() {
    const navigate = useNavigate()
    const setUser = useAuthStore((state) => state.setUser)

    const handleLogin = async (email: string, password: string) => {
        if (email === 'admin' && password === '1234') {
            setUser({
                id: 'dev-admin',
                email: null,
                role: 'superadmin',
                name: '개발용관리자',
                schoolname: 'test고등학교',
                location: null

            })
            alert('관리자 로그인 성공!')
            navigate('/')
            return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            // 🚫 로그인 실패
            console.error('로그인 에러: ', error.message)
            alert(`로그인 실패: ${error.message}`);
            return
        } else if (data.session) {
            // ✅ 로그인 성공
            // Supabase는 세션 정보가 있으면 내부적으로 토큰을 관리하므로,
            // 별도로 localStorage에 'token'을 저장할 필요는 없지만, 
            // 레거시 코드 호환을 위해 남겨둘 수 있습니다. (권장하지 않음)
            // localStorage.setItem('token', 'true');
            alert('로그인 성공!')
            navigate('/')
        } else {
            // data.session은 null이지만 에러가 없는 엣지 케이스 처리 (예: 이메일 미인증)
            alert('로그인 실패: 사용자의 세션을 가져올 수 없습니다.')
        }
    }

    // const handleLogin = (userId: string, password: string) => {
    //     if (userId === 'admin' && password === '1234') {
    //         localStorage.setItem('token', 'true')
    //         navigate('/')
    //     } else {
    //         alert('로그인 실패')
    //     }
    // }

    return (
        <div className={styles.body}>
            <div className={styles.loginPage}>
                <Logo />
                {/* <h1>Connecting Space</h1> */}
                {/* <h2>로그인</h2> */}
                <LoginForm onLogin={handleLogin} />
                <p>
                    계정이 없으신가요? {''}
                    <Link to='/signup' className={styles.link_text}>
                        회원가입
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage