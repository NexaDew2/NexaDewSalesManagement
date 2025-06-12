"use client"

const CompanyOwnerRegister = () => {
  return (
    <RegisterForm
      role="Company Owner"
      successRedirect="/"
      accentColor="purple"
      requireCompanyVerification={false}
    />
  )
}

export default CompanyOwnerRegister
