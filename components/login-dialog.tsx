"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authenticateUser, type UserProfile } from "@/lib/user-profile";

interface LoginDialogProps {
  onLogin: (user: UserProfile) => void;
}

export function LoginDialog({ onLogin }: LoginDialogProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // 컴포넌트 마운트 시 테스트 계정 초기화
    const { initializeTestUsers } = require("@/lib/user-profile");
    initializeTestUsers();
  }, []);

  const handleLogin = () => {
    setError("");
    
    if (!username || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    const user = authenticateUser(username, password);
    
    if (user) {
      onLogin(user);
      setUsername("");
      setPassword("");
      setError("");
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white hover:bg-gray-50">
          로그인
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>로그인</DialogTitle>
          <DialogDescription>
            테스트 계정으로 로그인하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              아이디
            </label>
            <Input
              id="username"
              placeholder="hong / kim / lee"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              placeholder="password123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          {error && (
            <div className="text-sm text-red-500">{error}</div>
          )}
          <div className="bg-purple-50 p-3 rounded-lg text-xs text-gray-600">
            <div className="font-semibold mb-1">테스트 계정:</div>
            <div>• hong / password123 (홍길동)</div>
            <div>• kim / password123 (김민수)</div>
            <div>• lee / password123 (이영희)</div>
          </div>
          <Button onClick={handleLogin} className="w-full bg-[#7c3aed] hover:bg-[#6d28d9]">
            로그인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


