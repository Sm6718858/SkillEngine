import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  useLoadUserQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/authApi";
import { useNavigate } from "react-router-dom";

export function Login() {
  const { refetch } = useLoadUserQuery();

  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [registerUser, { data, error, isLoading }] =
    useRegisterUserMutation();
  const [loginUser, { data: sData, error: sError, isLoading: sIsLoading }] =
    useLoginUserMutation();

  const changeInputHandle = (e, type) => {
    const { name, value } = e.target;
    type === "login"
      ? setLoginInput({ ...loginInput, [name]: value })
      : setSignupInput({ ...signupInput, [name]: value });
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    const inputData = type === "login" ? loginInput : signupInput;
    const action = type === "login" ? loginUser : registerUser;
    await action(inputData);
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (data?.message) {
      toast.success(data?.message);
      refetch();
    }
    if (sData?.message) {
      toast.success(sData?.message);
      refetch();
      navigate("/");
    }
    if (error?.data?.message) toast.error(error.data.message);
    if (sError?.data?.message) toast.error(sError.data.message);
  }, [data, sData, error, sError]);

  return (
    <div
      className="
      min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 
      dark:from-[#150812] dark:via-[#1a0b16] dark:to-[#10060f] 
      transition-colors p-4
    "
    >
      <div
        className="
        w-full max-w-md p-6 rounded-2xl
        bg-white/40 dark:bg-white/10
        backdrop-blur-2xl shadow-2xl
        border border-pink-200/50 dark:border-pink-700/40
        animate-fadeSlide
      "
      >
        <Tabs defaultValue="signup">

          <TabsList
            className="
            grid grid-cols-2 p-1 rounded-xl
            bg-pink-100/70 dark:bg-pink-900/20 
            shadow-inner backdrop-blur-md
          "
          >
            <TabsTrigger
              value="signup"
              className="
              rounded-lg text-sm font-semibold
              data-[state=active]:bg-white dark:data-[state=active]:bg-pink-900/40 
              data-[state=active]:text-pink-600 dark:data-[state=active]:text-pink-200
              shadow-sm transition-all
            "
            >
              Signup
            </TabsTrigger>

            <TabsTrigger
              value="login"
              className="
              rounded-lg text-sm font-semibold
              data-[state=active]:bg-white dark:data-[state=active]:bg-pink-900/40 
              data-[state=active]:text-pink-600 dark:data-[state=active]:text-pink-200
              shadow-sm transition-all
            "
            >
              Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signup" className="animate-fadeIn">
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-2xl font-extrabold text-pink-700 dark:text-pink-200">
                  Create an Account
                </CardTitle>
                <CardDescription className="dark:text-pink-300">
                  Enter your details below to get started.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-6">
                <FormField
                  label="Name"
                  name="name"
                  type="text"
                  value={signupInput.name}
                  onChange={(e) => changeInputHandle(e, "signup")}
                  placeholder="e.g. Shivam"
                />

                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={signupInput.email}
                  onChange={(e) => changeInputHandle(e, "signup")}
                  placeholder="example@gmail.com"
                />

                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandle(e, "signup")}
                  placeholder="******"
                />
              </CardContent>

              <CardFooter>
                <Button
                  disabled={isLoading}
                  onClick={(e) => handleSubmit(e, "signup")}
                  className="
                    w-full py-5 font-semibold text-white
                    bg-gradient-to-r from-pink-600 to-purple-600 
                    dark:from-pink-500 dark:to-purple-500
                    rounded-xl shadow-lg hover:opacity-90
                    transition-all
                  "
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Signup"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="login" className="animate-fadeIn">
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader>
                <CardTitle className="text-2xl font-extrabold text-pink-700 dark:text-pink-200">
                  Welcome Back
                </CardTitle>
                <CardDescription className="dark:text-pink-300">
                  Login to continue learning.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-6">
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandle(e, "login")}
                  placeholder="example@gmail.com"
                />

                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandle(e, "login")}
                  placeholder="******"
                />
              </CardContent>

              <CardFooter>
                <Button
                  disabled={sIsLoading}
                  onClick={(e) => handleSubmit(e, "login")}
                  className="
                    w-full py-5 font-semibold text-white
                    bg-gradient-to-r from-pink-600 to-purple-600 
                    dark:from-pink-500 dark:to-purple-500
                    rounded-xl shadow-lg hover:opacity-90
                    transition-all
                  "
                >
                  {sIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging In...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


function FormField({ label, name, type, value, onChange, placeholder }) {
  return (
    <div className="grid gap-2">
      <Label className="text-gray-700 dark:text-pink-200">{label}</Label>
      <Input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          bg-white/70 dark:bg-pink-900/20
          border border-pink-300/50 dark:border-pink-700/40
          rounded-xl px-4 py-2
          focus-visible:ring-pink-500 
          focus-visible:ring-2
          transition
        "
      />
    </div>
  );
}
