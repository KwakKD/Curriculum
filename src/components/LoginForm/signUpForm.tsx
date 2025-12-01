import { useState, type FormEvent } from "react"
import styles from './loginForm.module.css'
import { schooldata } from "../../data/schooldata"

interface SignUpFormProps {
    onSignUp: (
        email: string,
        password: string,
        confirmPassword: string,
        userName: string,
        selectedLocation: string,
        selectedSchool: string
    ) => void
}

function SignUpForm({ onSignUp }: SignUpFormProps) {
    const schoolList = Object.values(schooldata);
    // const schoolNameList = schoolList.map((item) => item.name)
    const schoolLocation = [...new Set(schoolList.map((item) => item.location))]
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [userName, setUserName] = useState<string>("")
    const [selectedLocation, setSelectedLocation] = useState<string>("")
    const [selectedSchool, setSelectedSchool] = useState<string>("")

    const filteredSelectSchool = selectedLocation === '' ? [] : schoolList.filter(item => item.location === selectedLocation).map(item => item.name)

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSignUp(email, password, confirmPassword, userName, selectedLocation, selectedSchool)
    }

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                    required
                />
                <input
                    type="text"
                    placeholder="이름"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className={styles.input}
                    required
                />
                <h4 style={{ margin: 0 }}>학교 찾기</h4>
                <div style={{ display: 'flex', gap: 10 }}>
                    <select
                        value={selectedLocation}
                        onChange={(e) => {
                            setSelectedLocation(e.target.value)
                            setSelectedSchool("")
                        }}
                        className={styles.input}>
                        <option value="">지역선택</option>
                        {schoolLocation.map((location, index) => (
                            <option key={index} value={location}>{location}</option>
                        ))}
                    </select>
                    <select
                        value={selectedSchool}
                        onChange={(e) => {
                            setSelectedSchool(e.target.value)
                        }}
                        className={styles.input}
                        disabled={!selectedLocation}>
                        <option value="">학교선택</option>
                        {selectedLocation && filteredSelectSchool.map((school, index) => (
                            <option key={index} value={school}>{school}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className={styles.signbutton}
                >
                    회원가입
                </button>

            </form>
            <button
                onClick={() => console.log(email, password, confirmPassword, userName, selectedLocation, selectedSchool)}
                className={styles.signbutton}
            >
                테스트

            </button>
        </>
    )
}

export default SignUpForm
