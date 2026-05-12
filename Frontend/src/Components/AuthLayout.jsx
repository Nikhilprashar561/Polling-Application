
const AuthLayout = ({ children, title, subtitle, footer }) => (
  <div className="noise flex min-h-screen items-center justify-center px-6 pb-12 pt-16">
    <div className="w-full max-w-md">
      
      {/* Header */}
      <div className="mb-10 text-center animate-fade-up">
        <h1 className="font-display mb-2 text-3xl font-bold text-black">
          {title}
        </h1>

        <p className="text-sm text-gray-500">
          {subtitle}
        </p>
      </div>

      {/* Card */}
      <div className="animate-fade-up anim-delay-1 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <p className="animate-fade-up anim-delay-2 mt-6 text-center text-sm text-gray-400">
          {footer}
        </p>
      )}
    </div>
  </div>
);

export default AuthLayout;
