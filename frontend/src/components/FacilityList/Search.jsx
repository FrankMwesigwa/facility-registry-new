import { useState, useEffect } from "react"

const Search = ({ onFilterChange, filterValue, clearSignal }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState(filterValue || "")

    const performSearch = async (query) => {
        if (!query.trim()) {
            onFilterChange("")
            setError(null)
            return
        }

        try {
            setIsLoading(true)
            setError(null)
            onFilterChange(query.trim())
        } catch (error) {
            console.error("Error searching facilities:", error)
            setError(error.response?.data?.message || "An error occurred while searching")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        performSearch(searchQuery)
    }

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value)
        setError(null) // Clear error when user types
    }

    const handleClearSearch = () => {
        setSearchQuery("")
        onFilterChange("")
        setError(null)
    }

    // Clear from parent when clearSignal changes
    useEffect(() => {
        if (clearSignal > 0) {
            setSearchQuery("")
            setError(null)
        }
    }, [clearSignal])

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} className="search-form">
                <div className="input-group">
                    <input 
                        type="text" 
                        className="form-control search-input border-start-0"
                        placeholder="Search by facility name, location, or services..."
                        value={searchQuery}
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        className="btn btn-primary search-btn"
                        disabled={isLoading || !searchQuery.trim()}
                    >
                        {isLoading ? (
                            <>
                                <i className="fas fa-spinner fa-spin me-1"></i>
                                Searching...
                            </>
                        ) : (
                            "Search"
                        )}
                    </button>
                    {searchQuery && (
                        <button 
                            type="button" 
                            className="btn btn-outline-secondary clear-btn"
                            onClick={handleClearSearch}
                            disabled={isLoading}
                            title="Clear search"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>
            </form>
            {error && (
                <div className="search-error mt-2">
                    <i className="fas fa-exclamation-triangle text-warning me-1"></i>
                    <small className="text-danger">{error}</small>
                </div>
            )}
        </div>
    )
}

export default Search