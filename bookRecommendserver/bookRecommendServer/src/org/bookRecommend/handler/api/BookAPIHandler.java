package org.bookRecommend.handler.api;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.bookRecommend.entities.Book;
import org.bookRecommend.entities.NCFRecommendResult;
import org.bookRecommend.service.BookService;
import org.bookRecommend.service.RecordService;
import org.bookRecommend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;

import static org.bookRecommend.service.impl.BookServiceImpl.getRandomBooks;

/**
 * 图书相关操作API
 
 */
@Controller
public class BookAPIHandler {
	
	@Autowired
	private BookService bookService;
	@Autowired
	private UserService userService;
	
	@Autowired
	private RecordService recordService;

	/**
	 * 获取全部图书一级分类接口
	 * @return 分类集合yang
	 */
	@ResponseBody
	@RequestMapping(value="api-book-classifyone-all")
	public ArrayList<String> getAllClassifyOne() {
		ArrayList<String> list = (ArrayList<String>) bookService.getAllClassifyOne();
		return list;
	}

	@ResponseBody
	@RequestMapping(value="speech-to-text")
	public String getText(@RequestParam("filePath") String filePath) throws Exception {
		return "23333";
	}
	/**
	 * 根据一级分类获取对应图书列表接口
	 * @return 图书集合
	 */
	@ResponseBody
	@RequestMapping(value="api-book-book-byclassifyone/{classifyOne}")
	public ArrayList<Book> getBookByClassifyOne(@PathVariable("classifyOne") String classifyOne) {
		ArrayList<Book> books = (ArrayList<Book>) bookService.getBookByClassifyOne(classifyOne);
		return books;
	}
	
	/**
	 * 根据id获取图书信息接口
	 * @return 图书信息
	 */
	@ResponseBody
	@RequestMapping(value="api-book-book-byid/{id}")
	public Book getBookById(@PathVariable("id") Integer id) {
		Book book = bookService.getBookById(id);
		return book;
	}
	
	/**
	 * 根据图书名模糊查询符合的图书
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value="api-book-book-bynamelike/{name}")
	public ArrayList<Book> getBookByNameLike(@PathVariable("name") String name) {
		ArrayList<Book> books = (ArrayList<Book>) bookService.getBookByNameLike(name);
		return books;
	}
	
	/**
	 * 记录用户浏览信息
	 * @param userId 用户id
	 * @param bookId 图书id
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value="api-record-browse")
	public String recordBrowse(@RequestParam("userId") Integer userId,
							   @RequestParam("bookId") Integer bookId) {
		recordService.recordBrowse(userId, bookId);
		return "1";
	}
	
	@ResponseBody
	@RequestMapping(value="api-book-recommend")
	public Set<Book> getBookRecommend(@RequestParam("bookId") Integer bookId) {
		ArrayList<Book> bookList = (ArrayList<Book>) bookService.getBookRecommendBook(bookId);
		Set<Book> bookSet = new HashSet<>();
		bookSet.addAll(bookList);
		return bookSet;
	}

	@ResponseBody
	@RequestMapping(value="api-ncf-recommend-result")
	public ArrayList<Book> getNCFRecommendResult(@RequestParam("userId") Integer userId) {
		ArrayList<NCFRecommendResult> results = bookService.getNCFRecommendResult(userId);
		ArrayList<Book> books = new ArrayList<>();
		for(NCFRecommendResult ncf:results){
			books.add(bookService.getBookById(ncf.getBookId()));
		}
        return getRandomBooks(books, 6);
	}


	@ResponseBody
	@RequestMapping(value="api-record-book-recommend")
	public String recordRecommend(@RequestParam("userId") Integer userId,@RequestParam("content") String content) {
		Pattern pattern = Pattern.compile("《(.*?)》");
		Matcher matcher = pattern.matcher(content);
		List<String> bookNames = new ArrayList<>();

		// 查找所有匹配的结果
		while (matcher.find()) {
			// 添加匹配到的书名到列表
			bookNames.add(matcher.group(1));
		}
		if(bookNames.isEmpty()) return "1";

		List<Integer> bookIds = new ArrayList<>();
		for (String bookName : bookNames) {
			ArrayList<Book> books= bookService.getBookByName(bookName); // 调用服务方法
			if(books==null) {
				System.out.println("没有这本书");
				continue;
			}
			for(Book book:books){
				bookIds.add(book.getBookId());
				System.out.println("Book ID: " + book.getBookId() + " for Book Name: " + book.getBookName());
			}
		}
		for(Integer bookId:bookIds){
			userService.addBookRecommend(userId,bookId);
		}
		return "1";
	}

}
