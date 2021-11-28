module.exports = {
    apps : [{
        name : 'town-chores',
        script : 'src/server.js',
        instances : "0",
        exec_mode : "cluster",
        max_memory_restart: '300M', // 프로세스의 메모리가 300MB에 도달하면 reload 실행

        output: "~/logs/pm2/console.log",
        error: "~/logs/pm2/onsoleError.log",
        env: {
            PORT: 8080,//Express PORT
            NODE_ENV: 'production',
        }
    }],
};

