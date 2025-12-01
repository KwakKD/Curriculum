import { useNavigate } from "react-router-dom";
import SignUpForm from "../components/LoginForm/signUpForm";
import { Link } from "react-router-dom";
import supabase from "../lib/supabaseClient";
import styles from './signUpPage.module.css'

export default function SignUpPage() {
    const navigate = useNavigate()

    const handleSignUp = async (
        email: string,
        password: string,
        confirmPassword: string,
        userName: string,
        selectedLocation: string,
        selectedSchool: string
    ) => {
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.')
            return
        }

        if (!selectedLocation || !selectedSchool) {
            alert('지역과 학교를 모두 선택해주세요.')
            return
        }

        if (!userName.trim()) {
            alert('이름을 입력해주세요.')
            return
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })

        if (error || !data.user) {
            alert('회원가입 실패');
            return
        }

        const user = data.user;

        const { error: userinfoEroor } = await supabase.from('userinfo').insert({
            id: user.id,
            name: userName,
            schoolname: selectedSchool,
            location: selectedLocation,
            role: 'user',
            isapproved : false
        })

        if (userinfoEroor) {
            console.error(userinfoEroor);
            alert('회원가입은 되었지만 프로필 저장에 실패했습니다.')
        }

        if (data) {
            alert(`${data.user?.email}님 환영합니다.`)
        }

        navigate("/login")
    }

    return (
        <div className={styles.body}>
            <div className={styles.signUpPage}>
                <h1>Connecting Space</h1>
                <h2>회원가입</h2>
                <SignUpForm onSignUp={handleSignUp} />
                <p>
                    이미 계정이 있으신가요?{" "}
                    <Link to="/login" className={styles.link_text}>
                        로그인
                    </Link>
                </p>
            </div>
        </div>
    )
}