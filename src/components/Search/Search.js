import React from 'react';

import './Search.css';
import axios from 'axios';
import PageNavigation from '../PageNavigation/PageNavigation';

class Search extends  React.Component {
	constructor( props ) {
		super( props );

		this.state = {
				query: '',
				results: {},
				error: '',
				message: '',
				loading: false,
				totalResults: 0,
				totalPages: 0,
				currentPageNo: 0,
		};	
		this.cancel = '';

	}

	// Total: result ; Denominator: results per page 
	getPagesCount = (total, denominator) => {
		const divisible = total % denominator === 0;
		const valueToBeAdded = divisible ? 0 : 1;
		return Math.floor(total / denominator) + valueToBeAdded;
	};

	fetchSearchResults = (updatedPageNo = '', query ) => {
		const pageNumber = updatedPageNo ? `&page=${updatedPageNo}` : '';
		// By default the limit of results is 20
		const searchUrl = `http://hn.algolia.com/api/v1/search?query=${query}${pageNumber}`;
		
		if (this.cancel) {
			// Cancel the previous request before making a new request
			this.cancel.cancel();
		}
		// Create a new CancelToken
		this.cancel = axios.CancelToken.source();
		axios
			.get(searchUrl, {
				cancelToken: this.cancel.token,
			})
			.then((res) => {
				const total = res.data.total;
				const totalPagesCount = this.getPagesCount( total, 20 );
				const resultNotFoundMsg = !res.data.hits.length
										? 'There are no more search results. Please try a new search.'
										: '';
					this.setState({
						results: res.data.hits,
						totalResults: total,
						currentPageNo: updatedPageNo,
						totalPages: totalPagesCount,
						message: resultNotFoundMsg,
						loading: false,
					});
			})
			.catch((error) => {
				if (axios.isCancel(error) || error) {
					this.setState({
						loading: false,
						message: 'Failed to fetch results.Please check network',
					});
				}
			});
	};

	handleOnInputChange = (event) => {
		const query = event.target.value;
		if ( ! query ) {
			this.setState({ query, results: {}, message: '', totalPages: 0, totalResults: 0  } );
		} else {
			this.setState({ query, loading: true, message: '' }, () => {
				this.fetchSearchResults(1, query);
			});
		}
	};

	renderSearchResults = () => {
		const {results} = this.state;
		if (Object.keys(results).length && results.length) {
			return (
				<div className="results-container">
					{results.map((result) => {
						return (
								<div className="result-items" key={result.objectID}>								
									<div className="image-wrapper">
										<img className="image"  src={result.story_text} alt={result.user}/>
									</div>
									<h6 className="i-username fa fa-user">{result.author}</h6>
									<h6 className="i-time fa fa-clock-o" >{result.created_at}</h6>
									<h6 className="i-points">{result.points} Points</h6>
									<h6 className="i-comments fa fa-comments">{result.num_comments}</h6>
									<a  href={result.url} >
										<h6 className="i-title " >{result.title}</h6>									
									</a>
								</div>
						);
					})}
				</div>
			);
		}
	};

	

	handlePageClick = (type) => {
		const updatedPageNo = 'prev' === type
					  ? this.state.currentPageNo - 1
					  : this.state.currentPageNo + 1;
		if (!this.state.loading) {
			this.setState({ loading: true, message: '' }, () => {
				// Fetch previous 20 Results
				this.fetchSearchResults(updatedPageNo, this.state.query);
			});
		}
		
	};
	

	render() {
		const { query, loading, message, currentPageNo, totalPages } = this.state;
		// showPrevLink will be false, when on the 1st page, hence Prev link be shown on 1st page.
		const showPrevLink = 1 < currentPageNo;
		// showNextLink will be false, when on the last page, hence Next link wont be shown last page.
		const showNextLink = totalPages > currentPageNo;

		return (
			<div className="container">
				{/*Heading*/}
				<h2 className="heading"> Search Hacker News</h2>
				{/*Search Input*/}
				<label className="search-label" htmlFor="search-input">
					<input
						type="text"
						value={query}
						id="search-input"
						placeholder="Search stories by title, url or author"
						onChange={this.handleOnInputChange}
					/>
					<i className="fa fa-search search-icon"/>
				</label>

				{message && <p className={"message"}>{message}</p>}

				{/*Search */}
				{ this.renderSearchResults() }

				<PageNavigation
					loading={loading}
					showPrevLink={showPrevLink}
					showNextLink={showNextLink}
					handlePrevClick={() => this.handlePageClick('prev' )}
					handleNextClick={() => this.handlePageClick('next' )}
				/>

			</div>
			)
	}
}
export default Search;