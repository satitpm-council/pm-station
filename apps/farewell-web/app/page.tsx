export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow">
      <h1>เข้าสู่ระบบ</h1>
      <form>
        <input
          type="text"
          className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  "
          placeholder="Test"
        />
      </form>
    </div>
  );
}
