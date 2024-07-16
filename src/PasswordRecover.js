export default function PasswordRecover() {
    return (
        <div className="content-container">
            <div className="form-container">
                <div>
                    <h4>RESET PASSWORD</h4>
                    <p style={{fontSize: '.7rem'}}>We will send you an email with instructions on how to recover it</p>
                    <form className="form">
                        <input
                          type="email"
                          placeholder="E-MAIL" 
                          required
                        />
                        <button>CONTINUE</button>
                    </form>
                </div>
            </div>
        </div>
    )
}