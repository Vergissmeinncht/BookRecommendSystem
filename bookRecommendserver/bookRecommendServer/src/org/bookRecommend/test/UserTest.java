package org.bookRecommend.test;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.bookRecommend.entities.Admin;
import org.bookRecommend.entities.User;
import org.bookRecommend.service.UserService;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * 用户相关单元测试类
 
 */
public class UserTest {
	
	private ApplicationContext applicationContext = null;
	private UserService userService = null;
	
	{
		applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
		userService = applicationContext.getBean(UserService.class);
	}
	
	/**
	 * 测试用户登录
	 */
	@Test
	public void testLogin() {
		String username1 = "root";
		String password1 = "root";
		System.out.println(userService.login(username1, password1));
		String username2 = "root";
		String password2 = "xxx";
		System.out.println(userService.login(username2, password2));
	}
	
	/**
	 * 测试用户注册
	 */
	@Test
	public void testRegister() {
		for (int i = 501; i <= 600; ++i) {
			String username = "testUser" + i;
			String password = "root";
			String password2 = "root";
			String email = "1936800723";
			System.out.println(userService.register(username, password, password2,email));
			System.out.println(i);
		}
	}
	
	/**
	 * 测试获取全部用户
	 */
	@Test
	public void testGetAllUser() {
		ArrayList<User> users =  (ArrayList<User>) userService.getAllUser();
		System.out.println(users.size());
	}
	
	/**
	 * 测试删除用户
	 */
	@Test
	public void testRemoveUser() {
		boolean removeSuccess = userService.removeUser(2);
		System.out.println(removeSuccess);
	}
	
	/**
	 * 测试修改用户信息
	 */
	@Test
	public void testEditUser() {
		userService.editUser(5, "root555", "root", 1, 1, 1, 60,"1936800723@qq.com");
	}
	
	/**
	 * 测试获取用户数量
	 */
	@Test
	public void testGetUserCount() {
		System.out.println(userService.getUserCount());
	}
	
	/**
	 * 生成随机散点图坐标
	 */
	@Test
	public void test() {
		userService.addBookRecommend(1,12);
	}
	
}
