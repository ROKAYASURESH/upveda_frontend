export default function Footer() {
    return (
        <footer className="bg-white rounded shadow p-5 mb-4 mt-4">
            <div className="row">
                <div className="col-12 col-md-4 col-xl-6 mb-4 mb-md-0">
                    <p className="mb-0 text-center text-lg-start">
                        © {new Date().getFullYear()}-
                        <span className="current-year" />
                        <a
                            className="text-primary fw-normal"
                            href="https://consistent.in/"
                            target="_blank"
                        >
                            Consistent
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}