package org.bookRecommend.handler.api;

import javax.servlet.http.HttpSession;

import org.bookRecommend.entities.Book;
import org.bookRecommend.entities.GPTRecommendResult;
import org.bookRecommend.entities.User;
import org.bookRecommend.service.BookService;
import org.bookRecommend.service.BorrowService;
import org.bookRecommend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.annotation.JsonFormat.Value;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;

/**
 * 用户相关操作API
 
 */
@Controller
public class UserAPIHandler {

	@Autowired
	private UserService userService;
	
	@Autowired
	private BorrowService borrowService;

	@Autowired
	private BookService bookService;
	
	/**
	 * 用户登录接口
	 * @return 1:登录成功 0:登录失败
	 */
	@ResponseBody
	@RequestMapping(value="api-user-login")
	public User login(@RequestParam("username") String username,
			@RequestParam("password") String password, HttpSession session) {
		boolean loginSuccess = userService.login(username, password);
		User user = null;
		if (loginSuccess) {
			user = userService.getUserByName(username);
			session.setAttribute("user", user);
		}
		return user;
	}
	
	/**
	 * 用户注册接口
	 */
	@ResponseBody
	@RequestMapping(value="api-user-register")
	public String register(@RequestParam("username") String username, 
			@RequestParam("password") String password, @RequestParam("password2") String password2,@RequestParam("email") String email) {
		boolean registerSuccess = userService.register(username, password, password2,email);
		if (registerSuccess) {
			return "1";
		} else {
			return "0";
		}
	}
	
	/**
	 * 退出登录接口
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value="api-user-exit")
	public String exit(HttpSession session) {
		session.removeAttribute("user");
		return "1";
	}
	
	/**
	 * 修改用户信息接口
	 * @return 1:成功 0:失败
	 */
	@ResponseBody
	@RequestMapping(value="api-user-edit")
	public String edit(@RequestParam("id") Integer id ,@RequestParam("username") String username, @RequestParam("password") String password,
			@RequestParam("messageStatus") Integer messageStatus, @RequestParam("newStatus") Integer newStatus,
			@RequestParam("forumStatus") Integer forumStatus, @RequestParam("recommendStatus") Integer recommendStatus, @RequestParam("email") String email) {
		if (!userService.editUser(id, username, password, messageStatus, newStatus, forumStatus, recommendStatus, email)) {
			return "0";
		}
		return "1";
	}
	
	/**
	 * 获取用户已借阅数
	 * @param userId
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value="api-user-borrow-number/{userId}")
	public Integer getBorrowNumber(@PathVariable("userId") Integer userId) {
		return borrowService.getBorrowByUserAndStatus(userId, 1).size() + borrowService.getBorrowByUserAndStatus(userId, 3).size();
	}

	@ResponseBody
	@RequestMapping(value="api-user-recommended-history")
	public ArrayList<Book> getBookByNameLike(@RequestParam("userId") Integer userId) {
		ArrayList<Book> books = new ArrayList<>();
		ArrayList<GPTRecommendResult> recommends = userService.getRecommendHistory(userId);
		recommends.sort((r1, r2) -> r2.getRecommendId() - r1.getRecommendId());
		for(GPTRecommendResult recommend:recommends){
			books.add(bookService.getBookById(recommend.getBookId()));
		}
		return books;
	}
	@ResponseBody
	@RequestMapping(value="api-user-remove-recommend")
	public void deleteRecommend(@RequestParam("userId") Integer userId,@RequestParam("bookId") Integer bookId){
		ArrayList<GPTRecommendResult> recommends = userService.getRecommendIdByIds(userId,bookId);
		for(GPTRecommendResult recommend:recommends){
			System.out.println(recommend.getRecommendId());
			userService.deleteRecommend(recommend.getRecommendId());
		}
	}

	
}
