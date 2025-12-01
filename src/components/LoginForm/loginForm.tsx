import { useState, type FormEvent } from "react"
import styles from './loginForm.module.css'

interface LoginFormProps {
    onLogin: (email: string, password: string) => Promise<void>
}

function LoginForm({ onLogin }: LoginFormProps) {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loading, setLoding] = useState<boolean>(false)
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoding(true)
        try {
            // 🌟 4. onLogin(상위 컴포넌트의 handleLogin) 호출 완료를 기다립니다.
            //    이렇게 해야 Supabase 서버 통신이 끝난 후 navigate가 실행됩니다.
            await onLogin(email, password)
        } catch (error) {
            console.error('로그인 처리 중 에러 발성: ', error)
        } finally {
            // navigate가 실행된 후 로딩 해제
            setLoding(false)
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <input
                placeholder="아이디"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                disabled={loading} // 로등 중 입력 비활성화
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                disabled={loading} // 로딩 중 입력 비활성화
            />
            <button
                type="submit"
                className={styles.button}
                disabled={loading} // 로등중 버튼 비활성화
            >
                {loading ? '로드인 중...' : '로그인'}
            </button>
        </form>
    )
}

export default LoginForm